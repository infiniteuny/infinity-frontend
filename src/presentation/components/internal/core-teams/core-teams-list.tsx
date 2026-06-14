'use client';

import Link from 'next/link';
import {
  AlertDialog,
  BooleanOperators,
  EmptyRowOverlay,
} from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  CoreTeam,
  CoreTeamFilterOptions,
  CoreTeamSortOptions,
  PaginationOptions,
} from '@app/domain/entities';
import {
  CoreTeamDto,
  CoreTeamMapper,
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
} from '@mui/x-data-grid';
import { DeleteCoreTeam, GetCoreTeams } from '@app/application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useInternalStore } from '@app/presentation/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  initialCoreTeams: CoreTeamDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function CoreTeamsList({ initialCoreTeams, initialPaginationOptions }: Props) {
  const getCoreTeams = useMemo(() => clientContainer.get<GetCoreTeams>(SYMBOLS.GetCoreTeams), []);
  const deleteCoreTeam = useMemo(
    () => clientContainer.get<DeleteCoreTeam>(SYMBOLS.DeleteCoreTeam),
    [],
  );
  const initCoreTeams = initialCoreTeams.map(CoreTeamMapper.fromDtoToDomain);
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = new Set(userSession?.permissions || []);

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedCoreTeamId, setSelectedCoreTeamId] = useState<string | null>(null);
  const [selectedCoreTeamYear, setSelectedCoreTeamYear] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<CoreTeam[]>(initCoreTeams);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initCoreTeams.length,
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
  const lastFetchedStateRef = useRef<string>(JSON.stringify({ filters: [], sort: [] }));

  const convertSortModelToDomain = (model: GridSortModel): CoreTeamSortOptions | undefined => {
    if (model.length === 0) return undefined;
    const fieldMap: Record<string, keyof CoreTeamSortOptions> = {
      id: 'id',
      year: 'year',
      isActive: 'isActive',
    };
    const sortOptions: CoreTeamSortOptions = {};
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
  ): CoreTeamFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;
    const filterOptions: CoreTeamFilterOptions = {};
    for (const filterItem of model.items) {
      switch (filterItem.field) {
        case 'isActive':
          if (filterItem.value != null) {
            filterOptions.isActive = Boolean(filterItem.value);
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
        const result = await getCoreTeams.execute(filterOptions, sortOptions, {
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
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [paginationModel, sortModel, filterModel, cursor, getCoreTeams]);

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
    router.push(`/core-teams/${params.row.id}`);
  };

  const handleDeleteClick = (coreTeamId: string, coreTeamYear?: string) => {
    setSelectedCoreTeamId(coreTeamId);
    setSelectedCoreTeamYear(coreTeamYear || null);
    setOpenDeleteDialog(true);
  };

  const handleDeleteAccept = async () => {
    if (!selectedCoreTeamId) {
      console.error('No core team selected for deletion');
      return;
    }
    const result = await deleteCoreTeam.execute(selectedCoreTeamId);
    match(result, {
      onRight: () => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedCoreTeamId));
      },
      onLeft: (error) => {
        console.error('Failed to delete core team:', error);
      },
    });
    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedCoreTeamId(null);
      setSelectedCoreTeamYear(null);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedCoreTeamId(null);
      setSelectedCoreTeamYear(null);
    }, 1000);
  };

  return (
    <>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedCoreTeamYear || 'this core team'}? This action cannot be undone.`}
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
                field: 'year',
                headerName: 'Year',
                flex: 1,
                minWidth: 100,
                filterable: false,
                sortable: false,
              },
              {
                field: 'isActive',
                headerName: 'Active',
                type: 'boolean',
                flex: 0.5,
                minWidth: 80,
                filterable: true,
                sortable: true,
                filterOperators: [BooleanOperators.is],
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
                      href={`/core-teams/${params.row.actions.id}`}
                    />
                    {['update-core-team'].some((p) => userPermissions.has(p)) ? (
                      <GridActionsCellItem
                        key="edit"
                        showInMenu
                        icon={<EditRounded />}
                        label="Edit"
                        component={Link}
                        // @ts-expect-error Link component requires href prop but it does not exposed as a prop for some reason. Read more on https://github.com/mui/mui-x/issues/9913
                        href={`/core-teams/${params.row.actions.id}/edit`}
                      />
                    ) : null}
                    {['delete-core-team'].some((p) => userPermissions.has(p)) ? (
                      <GridActionsCellItem
                        key="delete"
                        showInMenu
                        icon={<DeleteRounded />}
                        label="Delete"
                        onClick={() =>
                          handleDeleteClick(params.row.actions.id, `${params.row.actions.year}`)
                        }
                      />
                    ) : null}
                  </GridActionsCell>
                ),
              },
            ]}
            rows={rows.map((coreTeam) => ({
              id: coreTeam.id,
              year: coreTeam.year,
              isActive: coreTeam.isActive,
              actions: coreTeam,
            }))}
            slots={{
              noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
            }}
            slotProps={{
              noRowsOverlay: { text: 'No core teams found.' },
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
                  group: false,
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
