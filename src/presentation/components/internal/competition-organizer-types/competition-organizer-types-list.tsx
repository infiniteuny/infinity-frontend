'use client';

import Link from 'next/link';
import {
  AlertDialog,
  EmptyRowOverlay,
  SectionHeader,
  StringOperators,
} from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  CompetitionOrganizerType,
  CompetitionOrganizerTypeFilterOptions,
  CompetitionOrganizerTypeSortOptions,
  PaginationOptions,
} from '@app/domain/entities';
import {
  CompetitionOrganizerTypeDto,
  CompetitionOrganizerTypeMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
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
  useGridApiRef,
} from '@mui/x-data-grid';
import { DeleteCompetitionOrganizerType, GetCompetitionOrganizerTypes } from '@app/application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useInternalStore } from '@app/presentation/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CompetitionOrganizerTypesToolbar } from './competition-organizer-types-toolbar';

type Props = {
  initialCompetitionOrganizerTypes: CompetitionOrganizerTypeDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function CompetitionOrganizerTypesList({
  initialCompetitionOrganizerTypes,
  initialPaginationOptions,
}: Props) {
  const getCompetitionOrganizerTypes = useMemo(
    () => clientContainer.get<GetCompetitionOrganizerTypes>(SYMBOLS.GetCompetitionOrganizerTypes),
    [],
  );
  const deleteCompetitionOrganizerType = useMemo(
    () =>
      clientContainer.get<DeleteCompetitionOrganizerType>(SYMBOLS.DeleteCompetitionOrganizerType),
    [],
  );
  const initCompetitionOrganizerTypes = initialCompetitionOrganizerTypes.map(
    CompetitionOrganizerTypeMapper.fromDtoToDomain,
  );
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = new Set(userSession?.permissions || []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<CompetitionOrganizerType[]>(initCompetitionOrganizerTypes);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initCompetitionOrganizerTypes.length,
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
  const lastFetchedStateRef = useRef<string>(
    JSON.stringify({
      filters: [],
      sort: [],
      pagination: {
        page: initPaginationOptions.previousCursor ? 1 : 0,
        pageSize: initPaginationOptions.perPage || 25,
      },
    }),
  );
  const dataGridApiRef = useGridApiRef();

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedOrganizerTypeId, setSelectedOrganizerTypeId] = useState<string | null>(null);
  const [selectedOrganizerTypeName, setSelectedOrganizerTypeName] = useState<string | null>(null);

  const convertSortModelToDomain = (
    model: GridSortModel,
  ): CompetitionOrganizerTypeSortOptions | undefined => {
    if (model.length === 0) return undefined;

    const fieldMap: Record<string, keyof CompetitionOrganizerTypeSortOptions> = {
      id: 'id',
      name: 'name',
      weight: 'weight',
    };

    const sortOptions: CompetitionOrganizerTypeSortOptions = {};
    for (const sortItem of model) {
      const domainField = fieldMap[sortItem.field];
      if (domainField) {
        sortOptions[domainField] = sortItem.sort === 'asc' ? 'ASC' : 'DESC';
      }
    }

    return Object.keys(sortOptions).length > 0 ? sortOptions : undefined;
  };

  const convertFilterModelToDomain = (
    model: GridFilterModel,
  ): CompetitionOrganizerTypeFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;

    const filterOptions: CompetitionOrganizerTypeFilterOptions = {};

    for (const filterItem of model.items) {
      switch (filterItem.field) {
        case 'name':
          if (filterItem.value != null) {
            filterOptions.name = String(filterItem.value);
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

    const stateString = JSON.stringify({
      filters: filterModel.items
        .filter((item) => item.value != null && item.value !== '')
        .map((item) => ({ field: item.field, value: item.value })),
      sort: sortModel,
      pagination: paginationModel,
    });

    if (stateString === lastFetchedStateRef.current) {
      return;
    } else {
      lastFetchedStateRef.current = stateString;
    }

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      const sortOptions = convertSortModelToDomain(sortModel);
      const filterOptions = convertFilterModelToDomain(filterModel);

      try {
        const result = await getCompetitionOrganizerTypes.execute(filterOptions, sortOptions, {
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
  }, [paginationModel, sortModel, filterModel, cursor, getCompetitionOrganizerTypes]);

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
    router.push(`/competition-organizer-types/${params.row.id}`);
  };

  const handleDeleteClick = (organizerTypeId: string, organizerTypeName?: string) => {
    setSelectedOrganizerTypeId(organizerTypeId);
    setSelectedOrganizerTypeName(organizerTypeName || null);
    setOpenDeleteDialog(true);
  };

  const handleDeleteAccept = async () => {
    if (!selectedOrganizerTypeId) {
      console.error('No organizer type selected for deletion');
      return;
    }

    const result = await deleteCompetitionOrganizerType.execute(selectedOrganizerTypeId);
    match(result, {
      onRight: () => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedOrganizerTypeId));
      },
      onLeft: (error) => {
        console.error('Failed to delete organizer type:', error);
      },
    });

    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedOrganizerTypeId(null);
      setSelectedOrganizerTypeName(null);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedOrganizerTypeId(null);
      setSelectedOrganizerTypeName(null);
    }, 1000);
  };

  return (
    <>
      <SectionHeader title="Organizer Types">
        <CompetitionOrganizerTypesToolbar dataGridApiRef={dataGridApiRef} />
      </SectionHeader>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedOrganizerTypeName || 'this organizer type'}? This action cannot be undone.`}
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
                field: 'weight',
                headerName: 'Weight',
                flex: 1,
                minWidth: 100,
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
                      href={`/competition-organizer-types/${params.row.actions.id}`}
                    />
                    {['update-competition-organizer-type'].some((p) => userPermissions.has(p)) ? (
                      <GridActionsCellItem
                        key="edit"
                        showInMenu
                        icon={<EditRounded />}
                        label="Edit"
                        component={Link}
                        // @ts-expect-error Link component requires href prop but it does not exposed as a prop for some reason. Read more on https://github.com/mui/mui-x/issues/9913
                        href={`/competition-organizer-types/${params.row.actions.id}/edit`}
                      />
                    ) : null}
                    {['delete-competition-organizer-type'].some((p) => userPermissions.has(p)) ? (
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
            rows={rows.map((organizerType) => ({
              id: organizerType.id,
              name: organizerType.name,
              weight: organizerType.weight,
              actions: organizerType,
            }))}
            slots={{
              noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
            }}
            slotProps={{
              noRowsOverlay: { text: 'No competition organizer types found.' },
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
            apiRef={dataGridApiRef}
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
