'use client';

import Link from 'next/link';
import { Achievement, User } from '@infiniteuny/infinity-domain';
import {
  AchievementDto,
  AchievementMapper,
  PaginationOptionsDto,
} from '@infiniteuny/infinity-infrastructure/dtos';
import {
  AlertDialog,
  CompetitionInstanceFilterInput,
  CompetitionOutputFilterInput,
  CompetitionRankFilterInput,
  CompetitionScaleFilterInput,
  CompetitionTimeRangeFilterInput,
  EmptyRowOverlay,
  SectionHeader,
  StatusChip,
  StringOperators,
  TeamFilterInput,
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
import { DeleteAchievement, GetAchievements } from '@infiniteuny/infinity-application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { AchievementFilterOptions, AchievementSortOptions } from '@infiniteuny/infinity-domain';
import { SYMBOLS } from '@config';
import { useCursorDataGrid, useInternalStore, useUserPermissions } from '@app/presentation/hooks';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AchievementsToolbar } from './achievements-toolbar';

const DATA_GRID_SX: DataGridProps['sx'] = {
  '.MuiTablePagination-displayedRows': { display: 'none' },
  '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
};

const DATA_GRID_SLOTS: Partial<GridSlots> = {
  noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
};

const DATA_GRID_SLOT_PROPS: DataGridProps['slotProps'] = {
  noRowsOverlay: { text: 'No achievements found.' },
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
  initialAchievements: AchievementDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function AchievementsList({ initialAchievements, initialPaginationOptions }: Props) {
  const getAchievements = useMemo(
    () => clientContainer.get<GetAchievements>(SYMBOLS.GetAchievements),
    [],
  );
  const deleteAchievement = useMemo(
    () => clientContainer.get<DeleteAchievement>(SYMBOLS.DeleteAchievement),
    [],
  );
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = useUserPermissions();

  const convertSortModelToDomain = (model: GridSortModel): AchievementSortOptions | undefined => {
    if (model.length === 0) return undefined;

    const fieldMap: Record<string, keyof AchievementSortOptions> = {
      id: 'id',
      competitionBranch: 'competitionBranch',
      status: 'status',
    };

    const sortOptions: AchievementSortOptions = {};
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
  ): AchievementFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;

    const filterOptions: AchievementFilterOptions = {};

    for (const filterItem of model.items) {
      switch (filterItem.field) {
        case 'team':
          if (filterItem.value != null) {
            filterOptions.teamId = String(filterItem.value);
          }
          break;
        case 'competition':
          if (filterItem.value != null) {
            filterOptions.competitionInstanceId = String(filterItem.value);
          }
          break;
        case 'competitionScale':
          if (filterItem.value != null) {
            filterOptions.competitionScaleId = String(filterItem.value);
          }
          break;
        case 'competitionTimeRange':
          if (filterItem.value != null) {
            filterOptions.competitionTimeRangeId = String(filterItem.value);
          }
          break;
        case 'competitionOutput':
          if (filterItem.value != null) {
            filterOptions.competitionOutputId = String(filterItem.value);
          }
          break;
        case 'competitionRank':
          if (filterItem.value != null) {
            filterOptions.competitionRankId = String(filterItem.value);
          }
          break;
        case 'competitionBranch':
          if (filterItem.value != null) {
            filterOptions.competitionBranch = String(filterItem.value);
          }
          break;
        case 'status':
          if (filterItem.value != null) {
            filterOptions.status = String(filterItem.value) as 'PENDING' | 'REJECTED' | 'ACCEPTED';
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
    selectedName,
    isDeleting,
    handleDeleteClick,
    handleDeleteAccept,
    handleDeleteCancel,
    handleDeleteDialogExited,
  } = useCursorDataGrid<Achievement>({
    initialRows: () => initialAchievements.map(AchievementMapper.fromDtoToDomain),
    initialRowCount: initialAchievements.length,
    initialPaginationOptions,
    fetchPage: ({ filterModel, sortModel, pageSize, cursor, abortSignal }) => {
      const sortOptions = convertSortModelToDomain(sortModel);
      const filterOptions = convertFilterModelToDomain(filterModel);
      return getAchievements.execute(
        [
          'team',
          'team.members',
          'competition_instance',
          'competition_scale',
          'competition_time_range',
          'competition_output',
          'competition_rank',
        ],
        filterOptions,
        sortOptions,
        { perPage: pageSize, cursor },
        abortSignal,
      );
    },
    deleteRow: (id) => deleteAchievement.execute(id),
    entityLabel: 'achievements',
  });

  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      router.push(`/achievements/${params.row.id}`);
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
        field: 'team',
        headerName: 'Team',
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
            InputComponent: TeamFilterInput,
          },
        ],
      },
      {
        field: 'competition',
        headerName: 'Competition',
        flex: 2,
        minWidth: 200,
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
            InputComponent: CompetitionInstanceFilterInput,
          },
        ],
      },
      {
        field: 'competitionBranch',
        headerName: 'Branch',
        flex: 2,
        minWidth: 200,
        filterable: true,
        sortable: true,
        filterOperators: [StringOperators.contains],
      },
      {
        field: 'competitionScale',
        headerName: 'Scale',
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
            InputComponent: CompetitionScaleFilterInput,
          },
        ],
      },
      {
        field: 'competitionTimeRange',
        headerName: 'Time Range',
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
            InputComponent: CompetitionTimeRangeFilterInput,
          },
        ],
      },
      {
        field: 'competitionOutput',
        headerName: 'Output',
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
            InputComponent: CompetitionOutputFilterInput,
          },
        ],
      },
      {
        field: 'competitionRank',
        headerName: 'Rank',
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
            InputComponent: CompetitionRankFilterInput,
          },
        ],
      },
      {
        field: 'competitionStartDate',
        headerName: 'Start Date',
        flex: 1,
        minWidth: 100,
        filterable: false,
        sortable: false,
      },
      {
        field: 'competitionEndDate',
        headerName: 'End Date',
        flex: 1,
        minWidth: 100,
        filterable: false,
        sortable: false,
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        minWidth: 120,
        filterable: true,
        sortable: true,
        filterOperators: [StringOperators.equals],
        renderCell: (params) => <StatusChip status={String(params.value ?? '')} />,
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
              href={`/achievements/${params.row.actions.id}`}
            />
            {['update-achievement'].some((p) => userPermissions.has(p)) ||
            (['update-own-achievement'].some((p) => userPermissions.has(p)) &&
              params.row.actions.team?.members?.some(
                (member: User) => member.id === userSession?.user?.id,
              )) ? (
              <GridActionsCellItem
                key="edit"
                showInMenu
                icon={<EditRounded />}
                label="Edit"
                component={Link}
                href={`/achievements/${params.row.actions.id}/edit`}
              />
            ) : null}
            {['delete-achievement'].some((p) => userPermissions.has(p)) ||
            (['delete-own-achievement'].some((p) => userPermissions.has(p)) &&
              params.row.actions.team?.members?.some(
                (member: User) => member.id === userSession?.user?.id,
              )) ? (
              <GridActionsCellItem
                key="delete"
                showInMenu
                icon={<DeleteRounded />}
                label="Delete"
                onClick={() =>
                  handleDeleteClick(params.row.actions.id, params.row.actions.team?.name)
                }
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
      rows.map((achievement) => ({
        id: achievement.id,
        team: achievement.team?.name || 'N/A',
        competition: achievement.competitionInstance?.name || 'N/A',
        competitionScale: achievement.competitionScale?.name || 'N/A',
        competitionTimeRange: achievement.competitionTimeRange?.name || 'N/A',
        competitionOutput: achievement.competitionOutput?.name || 'N/A',
        competitionRank: achievement.competitionRank?.name || 'N/A',
        competitionBranch: achievement.competitionBranch,
        competitionStartDate: achievement.competitionStartDate.toLocaleDateString(),
        competitionEndDate: achievement.competitionEndDate.toLocaleDateString(),
        status: achievement.status,
        actions: achievement,
      })),
    [rows],
  );

  return (
    <>
      <SectionHeader title="Achievements">
        <AchievementsToolbar dataGridApiRef={dataGridApiRef} />
      </SectionHeader>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        onExited={handleDeleteDialogExited}
        isLoading={isDeleting}
        confirmColor="error"
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedName || 'this achievement'}? This action cannot be undone.`}
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
