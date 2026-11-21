'use client';

import Link from 'next/link';
import {
  AlertDialog,
  BooleanOperators,
  EmptyRowOverlay,
  SectionHeader,
} from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CoreTeam, CoreTeamFilterOptions, CoreTeamSortOptions } from '@infiniteuny/infinity-domain';
import {
  CoreTeamDto,
  CoreTeamMapper,
  PaginationOptionsDto,
} from '@infiniteuny/infinity-infrastructure';
import {
  DataGrid,
  DataGridProps,
  GridActionsCell,
  GridActionsCellItem,
  GridColDef,
  GridFilterModel,
  GridRowParams,
  GridSlots,
  GridSortModel,
} from '@mui/x-data-grid';
import { DeleteCoreTeam, GetCoreTeams } from '@infiniteuny/infinity-application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { SYMBOLS } from '@config';
import { useCursorDataGrid, useUserPermissions } from '@app/presentation/hooks';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CoreTeamsToolbar } from './core-teams-toolbar';

const DATA_GRID_SX: DataGridProps['sx'] = {
  '.MuiTablePagination-displayedRows': { display: 'none' },
  '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
};

const DATA_GRID_SLOTS: Partial<GridSlots> = {
  noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
};

const DATA_GRID_SLOT_PROPS: DataGridProps['slotProps'] = {
  noRowsOverlay: { text: 'No core teams found.' },
  loadingOverlay: {
    variant: 'skeleton',
    noRowsVariant: 'skeleton',
  },
};

const DATA_GRID_PAGE_SIZE_OPTIONS = [25, 50, 100];

const DATA_GRID_INITIAL_STATE: DataGridProps['initialState'] = {
  columns: {
    columnVisibilityModel: {
      id: false,
      group: false,
    },
  },
};

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
  const router = useRouter();
  const userPermissions = useUserPermissions();

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

  const {
    rows,
    rowCount,
    isLoading,
    filterModel,
    paginationModel,
    sortModel,
    paginationMeta,
    dataGridApiRef,
    handlePaginationModelChange,
    handleSortModelChange,
    handleFilterModelChange,
    openDeleteDialog,
    selectedName: selectedCoreTeamYear,
    handleDeleteClick,
    handleDeleteAccept,
    handleDeleteCancel,
    handleDeleteDialogExited,
  } = useCursorDataGrid<CoreTeam>({
    initialRows: () => initialCoreTeams.map(CoreTeamMapper.fromDtoToDomain),
    initialRowCount: initialCoreTeams.length,
    initialPaginationOptions,
    fetchPage: ({ filterModel, sortModel, pageSize, cursor }) => {
      const sortOptions = convertSortModelToDomain(sortModel);
      const filterOptions = convertFilterModelToDomain(filterModel);
      return getCoreTeams.execute(filterOptions, sortOptions, {
        perPage: pageSize,
        cursor,
      });
    },
    deleteRow: (id) => deleteCoreTeam.execute(id),
    entityLabel: 'core teams',
  });

  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      router.push(`/core-teams/${params.row.id}`);
    },
    [router],
  );

  const columns = useMemo<GridColDef[]>(
    () => [
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
              href={`/core-teams/${params.row.actions.id}`}
            />
            {['update-core-team'].some((p) => userPermissions.has(p)) ? (
              <GridActionsCellItem
                key="edit"
                showInMenu
                icon={<EditRounded />}
                label="Edit"
                component={Link}
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
    ],
    [userPermissions, handleDeleteClick],
  );

  const gridRows = useMemo(
    () =>
      rows.map((coreTeam) => ({
        id: coreTeam.id,
        year: coreTeam.year,
        isActive: coreTeam.isActive,
        actions: coreTeam,
      })),
    [rows],
  );

  return (
    <>
      <SectionHeader title="Core Teams">
        <CoreTeamsToolbar dataGridApiRef={dataGridApiRef} />
      </SectionHeader>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        onExited={handleDeleteDialogExited}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedCoreTeamYear || 'this core team'}? This action cannot be undone.`}
        acceptText="Delete"
        cancelText="Cancel"
      />
      <Box component="section" className="mb-6 w-full px-6">
        <NoSsr>
          <DataGrid
            sx={DATA_GRID_SX}
            columns={columns}
            rows={gridRows}
            slots={DATA_GRID_SLOTS}
            slotProps={DATA_GRID_SLOT_PROPS}
            pageSizeOptions={DATA_GRID_PAGE_SIZE_OPTIONS}
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            initialState={DATA_GRID_INITIAL_STATE}
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
