'use client';

import Link from 'next/link';
import {
  AlertDialog,
  CompetitionTeamTypeFilterInput,
  SectionHeader,
  EmptyRowOverlay,
  StringOperators,
  UserFilterInput,
} from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
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
import { DeleteTeam, GetTeams } from '@infiniteuny/infinity-application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { Team, TeamFilterOptions, TeamSortOptions } from '@infiniteuny/infinity-domain';
import { PaginationOptionsDto, TeamDto, TeamMapper } from '@infiniteuny/infinity-infrastructure';
import { SYMBOLS } from '@config';
import { useCursorDataGrid, useInternalStore, useUserPermissions } from '@app/presentation/hooks';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TeamsToolbar } from './teams-toolbar';

const DATA_GRID_SX: DataGridProps['sx'] = {
  '.MuiTablePagination-displayedRows': { display: 'none' },
  '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
};

const DATA_GRID_SLOTS: Partial<GridSlots> = {
  noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
};

const DATA_GRID_SLOT_PROPS: DataGridProps['slotProps'] = {
  noRowsOverlay: { text: 'No teams found.' },
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
    },
  },
};

type Props = {
  initialTeams: TeamDto[];
  initialPaginationOptions: PaginationOptionsDto;
  defaultTeamTypeIdFilter?: string;
};

export function TeamsList({
  initialTeams,
  initialPaginationOptions,
  defaultTeamTypeIdFilter,
}: Props) {
  const getTeams = useMemo(() => clientContainer.get<GetTeams>(SYMBOLS.GetTeams), []);
  const deleteTeam = useMemo(() => clientContainer.get<DeleteTeam>(SYMBOLS.DeleteTeam), []);
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = useUserPermissions();

  const convertSortModelToDomain = (model: GridSortModel): TeamSortOptions | undefined => {
    if (model.length === 0) return undefined;

    const fieldMap: Record<string, keyof TeamSortOptions> = {
      id: 'id',
      name: 'name',
    };

    const sortOptions: TeamSortOptions = {};
    for (const sortItem of model) {
      const domainField = fieldMap[sortItem.field];
      if (domainField) {
        sortOptions[domainField] = sortItem.sort === 'asc' ? 'ASC' : 'DESC';
      }
    }

    return Object.keys(sortOptions).length > 0 ? sortOptions : undefined;
  };

  const convertFilterModelToDomain = useCallback(
    (model: GridFilterModel): TeamFilterOptions | undefined => {
      const filterOptions: TeamFilterOptions = defaultTeamTypeIdFilter
        ? { teamTypeId: defaultTeamTypeIdFilter }
        : {};

      for (const filterItem of model.items) {
        switch (filterItem.field) {
          case 'name':
            if (filterItem.value != null) {
              filterOptions.name = String(filterItem.value);
            }
            break;
          case 'leader':
            if (filterItem.value != null) {
              filterOptions.leaderId = String(filterItem.value);
            }
            break;
          case 'team_type':
            if (filterItem.value != null && filterItem.value !== '') {
              filterOptions.teamTypeId = String(filterItem.value);
            }
            break;
        }
      }

      return Object.keys(filterOptions).length > 0 ? filterOptions : undefined;
    },
    [defaultTeamTypeIdFilter],
  );

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
    selectedName: selectedTeamName,
    isDeleting,
    handleDeleteClick,
    handleDeleteAccept,
    handleDeleteCancel,
    handleDeleteDialogExited,
  } = useCursorDataGrid<Team>({
    initialRows: () => initialTeams.map(TeamMapper.fromDtoToDomain),
    initialRowCount: initialTeams.length,
    initialPaginationOptions,
    fetchPage: ({ filterModel, sortModel, pageSize, cursor, abortSignal }) => {
      const sortOptions = convertSortModelToDomain(sortModel);
      const filterOptions = convertFilterModelToDomain(filterModel);
      return getTeams.execute(
        ['leader', 'members', 'team_type'],
        filterOptions,
        sortOptions,
        { perPage: pageSize, cursor },
        abortSignal,
      );
    },
    deleteRow: (id) => deleteTeam.execute(id),
    entityLabel: 'teams',
  });

  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      router.push(`/teams/${params.row.id}`);
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
        field: 'name',
        headerName: 'Name',
        flex: 2,
        minWidth: 200,
        filterable: true,
        sortable: true,
        filterOperators: [StringOperators.contains],
      },
      {
        field: 'leader',
        headerName: 'Leader',
        flex: 2,
        minWidth: 300,
        filterable: true,
        sortable: false,
        filterOperators: [
          {
            label: 'is',
            value: 'is',
            getApplyFilterFn: (filterItem) => {
              if (!filterItem.field || !filterItem.value || !filterItem.operator) {
                return null;
              }

              return (value) => {
                return value === filterItem.value;
              };
            },
            InputComponent: UserFilterInput,
          },
        ],
      },
      {
        field: 'team_type',
        headerName: 'Team Type',
        flex: 1,
        minWidth: 170,
        filterable: true,
        sortable: false,
        filterOperators: [
          {
            label: 'is',
            value: 'is',
            getApplyFilterFn: (filterItem) => {
              if (!filterItem.field || !filterItem.value || !filterItem.operator) {
                return null;
              }

              return (value) => {
                return value === filterItem.value;
              };
            },
            InputComponent: CompetitionTeamTypeFilterInput,
          },
        ],
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
              href={`/teams/${params.row.actions.id}`}
            />
            {['update-team'].some((p) => userPermissions.has(p)) ||
            (['update-own-team'].some((p) => userPermissions.has(p)) &&
              params.row.actions.leader?.id === userSession?.user?.id) ? (
              <GridActionsCellItem
                key="edit"
                showInMenu
                icon={<EditRounded />}
                label="Edit"
                component={Link}
                href={`/teams/${params.row.actions.id}/edit`}
              />
            ) : null}
            {['delete-team'].some((p) => userPermissions.has(p)) ||
            (['delete-own-team'].some((p) => userPermissions.has(p)) &&
              params.row.actions.leader?.id === userSession?.user?.id) ? (
              <GridActionsCellItem
                key="delete"
                showInMenu
                icon={<DeleteRounded />}
                label="Delete"
                onClick={() => handleDeleteClick(params.row.actions.id, params.row.actions.name)}
              />
            ) : null}
          </GridActionsCell>
        ),
      },
    ],
    [userPermissions, userSession?.user?.id, handleDeleteClick],
  );

  const gridRows = useMemo(
    () =>
      rows.map((team) => ({
        id: team.id,
        name: team.name,
        leader: team.leader?.name || 'N/A',
        team_type: team.teamType?.name || 'N/A',
        actions: team,
      })),
    [rows],
  );

  return (
    <>
      <SectionHeader title="Teams">
        <TeamsToolbar dataGridApiRef={dataGridApiRef} />
      </SectionHeader>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        onExited={handleDeleteDialogExited}
        isLoading={isDeleting}
        confirmColor="error"
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedTeamName || 'this team'}? This action cannot be undone.`}
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
