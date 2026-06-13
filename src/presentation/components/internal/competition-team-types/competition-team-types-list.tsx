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
  CompetitionTeamType,
  CompetitionTeamTypeFilterOptions,
  CompetitionTeamTypeSortOptions,
  PaginationOptions,
} from '@app/domain/entities';
import {
  CompetitionTeamTypeDto,
  CompetitionTeamTypeMapper,
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
import { DeleteCompetitionTeamType, GetCompetitionTeamTypes } from '@app/application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useInternalStore } from '@app/presentation/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  initialCompetitionTeamTypes: CompetitionTeamTypeDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function CompetitionTeamTypesList({
  initialCompetitionTeamTypes,
  initialPaginationOptions,
}: Props) {
  const getCompetitionTeamTypes = useMemo(
    () => clientContainer.get<GetCompetitionTeamTypes>(SYMBOLS.GetCompetitionTeamTypes),
    [],
  );
  const deleteCompetitionTeamType = useMemo(
    () => clientContainer.get<DeleteCompetitionTeamType>(SYMBOLS.DeleteCompetitionTeamType),
    [],
  );
  const initCompetitionTeamTypes = initialCompetitionTeamTypes.map(
    CompetitionTeamTypeMapper.fromDtoToDomain,
  );
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = new Set(userSession?.permissions || []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<CompetitionTeamType[]>(initCompetitionTeamTypes);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initCompetitionTeamTypes.length,
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
  const [selectedteamTypeId, setSelectedteamTypeId] = useState<string | null>(null);
  const [selectedteamTypeName, setSelectedteamTypeName] = useState<string | null>(null);

  const convertSortModelToDomain = (
    model: GridSortModel,
  ): CompetitionTeamTypeSortOptions | undefined => {
    if (model.length === 0) return undefined;
    const fieldMap: Record<string, keyof CompetitionTeamTypeSortOptions> = {
      id: 'id',
      name: 'name',
      weight: 'weight',
    };
    const sortOptions: CompetitionTeamTypeSortOptions = {};
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
  ): CompetitionTeamTypeFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;
    const filterOptions: CompetitionTeamTypeFilterOptions = {};
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
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      const sortOptions = convertSortModelToDomain(sortModel);
      const filterOptions = convertFilterModelToDomain(filterModel);
      try {
        const result = await getCompetitionTeamTypes.execute(filterOptions, sortOptions, {
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
  }, [paginationModel, sortModel, filterModel, cursor, getCompetitionTeamTypes]);

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
    router.push(`/competition-teamTypes/${params.row.id}`);
  };

  const handleDeleteClick = (teamTypeId: string, teamTypeName?: string) => {
    setSelectedteamTypeId(teamTypeId);
    setSelectedteamTypeName(teamTypeName || null);
    setOpenDeleteDialog(true);
  };

  const handleDeleteAccept = async () => {
    if (!selectedteamTypeId) {
      console.error('No teamType selected for deletion');
      return;
    }
    const result = await deleteCompetitionTeamType.execute(selectedteamTypeId);
    match(result, {
      onRight: () => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedteamTypeId));
      },
      onLeft: (error) => {
        console.error('Failed to delete teamType:', error);
      },
    });
    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedteamTypeId(null);
      setSelectedteamTypeName(null);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedteamTypeId(null);
      setSelectedteamTypeName(null);
    }, 1000);
  };

  return (
    <>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedteamTypeName || 'this teamType'}? This action cannot be undone.`}
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
                      href={`/competition-teamTypes/${params.row.actions.id}`}
                    />
                    {['update-competition-teamType'].some((p) => userPermissions.has(p)) ? (
                      <GridActionsCellItem
                        key="edit"
                        showInMenu
                        icon={<EditRounded />}
                        label="Edit"
                        component={Link}
                        // @ts-expect-error Link component requires href prop but it does not exposed as a prop for some reason. Read more on https://github.com/mui/mui-x/issues/9913
                        href={`/competition-teamTypes/${params.row.actions.id}/edit`}
                      />
                    ) : null}
                    {['delete-competition-teamType'].some((p) => userPermissions.has(p)) ? (
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
            rows={rows.map((teamType) => ({
              id: teamType.id,
              name: teamType.name,
              weight: teamType.weight,
              actions: teamType,
            }))}
            slots={{
              noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
            }}
            slotProps={{
              noRowsOverlay: { text: 'No competition teamTypes found.' },
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
