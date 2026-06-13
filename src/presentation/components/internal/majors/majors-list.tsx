'use client';

import Link from 'next/link';
import {
  AlertDialog,
  EmptyRowOverlay,
  StringOperators,
} from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  DataGrid,
  GridActionsCell,
  GridActionsCellItem,
  GridFilterModel,
  GridPaginationMeta,
  GridPaginationModel,
  GridRowParams,
  GridSlots,
  GridSortModel,
} from '@mui/x-data-grid';
import { DeleteMajor, GetMajors } from '@app/application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import {
  Major,
  MajorFilterOptions,
  MajorSortOptions,
  PaginationOptions,
} from '@app/domain/entities';
import {
  MajorDto,
  MajorMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useInternalStore } from '@app/presentation/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  initialMajors: MajorDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function MajorsList({ initialMajors, initialPaginationOptions }: Props) {
  const getMajors = useMemo(() => clientContainer.get<GetMajors>(SYMBOLS.GetMajors), []);
  const deleteMajor = useMemo(() => clientContainer.get<DeleteMajor>(SYMBOLS.DeleteMajor), []);
  const initMajors = initialMajors.map(MajorMapper.fromDtoToDomain);
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = new Set(userSession?.permissions || []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<Major[]>(initMajors);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initMajors.length,
  );
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: initPaginationOptions.previousCursor ? 1 : 0,
    pageSize: initPaginationOptions.perPage || 25,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [paginationMeta, setPaginationMeta] = useState<GridPaginationMeta>({
    hasNextPage: Boolean(initPaginationOptions.nextCursor),
  });
  const [paginationOptions, setPaginationOptions] =
    useState<Pick<PaginationOptions, 'cursor' | 'nextCursor' | 'previousCursor'>>(
      initPaginationOptions,
    );
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const isInitialMount = useRef(true);

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedMajorId, setSelectedMajorId] = useState<string | null>(null);
  const [selectedMajorName, setSelectedMajorName] = useState<string | null>(null);

  const convertSortModelToDomain = (model: GridSortModel): MajorSortOptions | undefined => {
    if (model.length === 0) return undefined;

    const fieldMap: Record<string, keyof MajorSortOptions> = {
      name: 'name',
      code: 'code',
    };

    const sortOptions: MajorSortOptions = {};
    for (const sortItem of model) {
      const domainField = fieldMap[sortItem.field];
      if (domainField) {
        sortOptions[domainField] = sortItem.sort === 'asc' ? 'ASC' : 'DESC';
      }
    }

    return Object.keys(sortOptions).length > 0 ? sortOptions : undefined;
  };

  const convertFilterModelToDomain = (model: GridFilterModel): MajorFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;

    const filterOptions: MajorFilterOptions = {};

    for (const filterItem of model.items) {
      switch (filterItem.field) {
        case 'name':
          if (filterItem.value != null) {
            filterOptions.name = String(filterItem.value);
          }
          break;
        case 'code':
          if (filterItem.value != null) {
            filterOptions.code = String(filterItem.value);
          }
          break;
      }
    }

    return Object.keys(filterOptions).length > 0 ? filterOptions : undefined;
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      const sortOptions = convertSortModelToDomain(sortModel);
      const filterOptions = convertFilterModelToDomain(filterModel);

      try {
        const result = await getMajors.execute(['degree', 'faculty'], filterOptions, sortOptions, {
          perPage: paginationModel.pageSize,
          cursor,
        });

        if (cancelled) return;

        match(result, {
          onRight: ([newRows, nextPaginationOptions]) => {
            const hasNextPage = Boolean(nextPaginationOptions.nextCursor);

            setRows(newRows);
            setRowCount(
              hasNextPage ? -1 : paginationModel.page * paginationModel.pageSize + newRows.length,
            );
            setPaginationMeta({ hasNextPage });
            setPaginationOptions(nextPaginationOptions);
          },
          onLeft: (error) => {
            throw error;
          },
        });
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [paginationModel, sortModel, filterModel, cursor, getMajors]);

  const handlePaginationModelChange = useCallback(
    (newPaginationModel: GridPaginationModel) => {
      const isPageSizeChanged = newPaginationModel.pageSize !== paginationModel.pageSize;
      const normalizedPaginationModel = isPageSizeChanged
        ? { ...newPaginationModel, page: 0 }
        : newPaginationModel;

      let nextCursor: string | undefined;
      if (isPageSizeChanged) {
        nextCursor = undefined;
      } else if (
        normalizedPaginationModel.page > paginationModel.page &&
        paginationOptions.nextCursor
      ) {
        nextCursor = paginationOptions.nextCursor;
      } else if (
        normalizedPaginationModel.page < paginationModel.page &&
        paginationOptions.previousCursor
      ) {
        nextCursor = paginationOptions.previousCursor;
      } else {
        nextCursor = paginationOptions.cursor;
      }

      setCursor(nextCursor);
      setPaginationModel(normalizedPaginationModel);
    },
    [paginationModel, paginationOptions],
  );

  const handleSortModelChange = useCallback((newSortModel: GridSortModel) => {
    setCursor(undefined);
    setPaginationModel((prev) => ({ page: 0, pageSize: prev.pageSize }));
    setSortModel(newSortModel);
  }, []);

  const handleFilterModelChange = useCallback((newFilterModel: GridFilterModel) => {
    setCursor(undefined);
    setPaginationModel((prev) => ({ page: 0, pageSize: prev.pageSize }));
    setFilterModel(newFilterModel);
  }, []);

  const handleRowClick = (params: GridRowParams) => {
    router.push(`/majors/${params.row.id}`);
  };

  const handleDeleteClick = (majorId: string, majorName?: string) => {
    setSelectedMajorId(majorId);
    setSelectedMajorName(majorName || null);
    setOpenDeleteDialog(true);
  };

  const handleDeleteAccept = async () => {
    if (!selectedMajorId) {
      console.error('No major selected for deletion');
      return;
    }

    const result = await deleteMajor.execute(selectedMajorId);
    match(result, {
      onRight: () => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedMajorId));
      },
      onLeft: (error) => {
        console.error('Failed to delete major:', error);
      },
    });

    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedMajorId(null);
      setSelectedMajorName(null);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedMajorId(null);
      setSelectedMajorName(null);
    }, 1000);
  };

  return (
    <>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedMajorName || 'this major'}? This action cannot be undone.`}
        acceptText="Delete"
        cancelText="Cancel"
      />
      <Box component="section" className="mb-6 w-full px-6">
        <NoSsr>
          <DataGrid
            sx={{
              '.MuiTablePagination-displayedRows': { display: 'none' },
              '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
            }}
            columns={[
              {
                field: 'id',
                headerName: 'ID',
                flex: 1,
                minWidth: 300,
                filterable: false,
                sortable: true,
              },
              {
                field: 'name',
                headerName: 'Name',
                flex: 2,
                minWidth: 200,
                filterable: true,
                sortable: true,
                filterOperators: [StringOperators.contains],
              },
              {
                field: 'code',
                headerName: 'Code',
                flex: 1,
                minWidth: 120,
                filterable: true,
                sortable: true,
                filterOperators: [StringOperators.equals],
              },
              {
                field: 'degree',
                headerName: 'Degree',
                flex: 1.5,
                minWidth: 170,
                filterable: false,
                sortable: false,
              },
              {
                field: 'faculty',
                headerName: 'Faculty',
                flex: 1.5,
                minWidth: 170,
                filterable: false,
                sortable: false,
              },
              {
                field: 'actions',
                type: 'actions',
                headerName: '',
                flex: 0.5,
                minWidth: 50,
                maxWidth: 50,
                renderCell: (params) => (
                  <GridActionsCell {...params}>
                    <GridActionsCellItem
                      key="view"
                      showInMenu
                      icon={<VisibilityRounded />}
                      label="View"
                      component={Link}
                      // @ts-expect-error Link component requires href prop but it does not exposed as a prop for some reason. Read more on https://github.com/mui/mui-x/issues/9913
                      href={`/majors/${params.row.actions.id}`}
                    />
                    {['update-major'].some((p) => userPermissions.has(p)) ? (
                      <GridActionsCellItem
                        key="edit"
                        showInMenu
                        icon={<EditRounded />}
                        label="Edit"
                        component={Link}
                        // @ts-expect-error Link component requires href prop but it does not exposed as a prop for some reason. Read more on https://github.com/mui/mui-x/issues/9913
                        href={`/majors/${params.row.actions.id}/edit`}
                      />
                    ) : null}
                    {['delete-major'].some((p) => userPermissions.has(p)) ? (
                      <GridActionsCellItem
                        key="delete"
                        showInMenu
                        icon={<DeleteRounded />}
                        label="Delete"
                        onClick={() =>
                          handleDeleteClick(params.row.actions.id, params.row.actions.name)
                        }
                      />
                    ) : null}
                  </GridActionsCell>
                ),
              },
            ]}
            rows={rows.map((major) => ({
              id: major.id,
              code: major.code,
              name: major.name,
              degree: major.degree?.name || 'N/A',
              faculty: major.faculty?.name || 'N/A',
              actions: major,
            }))}
            slots={{
              noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
            }}
            slotProps={{
              noRowsOverlay: { text: 'No majors found.' },
              loadingOverlay: {
                variant: 'skeleton',
                noRowsVariant: 'skeleton',
              },
            }}
            pageSizeOptions={[25, 50, 100]}
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            initialState={{
              columns: {
                columnVisibilityModel: {
                  id: false,
                },
              },
            }}
            loading={isLoading}
            rowCount={rowCount}
            paginationMeta={paginationMeta}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            filterModel={filterModel}
            onFilterModelChange={handleFilterModelChange}
            onRowClick={handleRowClick}
            disableRowSelectionOnClick
          />
        </NoSsr>
      </Box>
    </>
  );
}
