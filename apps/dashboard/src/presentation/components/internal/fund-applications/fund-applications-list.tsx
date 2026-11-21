'use client';

import Link from 'next/link';
import {
  AlertDialog,
  CompetitionInstanceFilterInput,
  CompetitionScaleFilterInput,
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
import { DeleteFundApplication, GetFundApplications } from '@infiniteuny/infinity-application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import {
  FundApplication,
  FundApplicationFilterOptions,
  FundApplicationSortOptions,
  User,
} from '@infiniteuny/infinity-domain';
import {
  FundApplicationDto,
  FundApplicationMapper,
  PaginationOptionsDto,
} from '@infiniteuny/infinity-infrastructure/dtos';
import { SYMBOLS } from '@config';
import { useCursorDataGrid, useInternalStore, useUserPermissions } from '@app/presentation/hooks';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FundApplicationsToolbar } from './fund-applications-toolbar';

const DATA_GRID_SX: DataGridProps['sx'] = {
  '.MuiTablePagination-displayedRows': { display: 'none' },
  '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
};

const DATA_GRID_SLOTS: Partial<GridSlots> = {
  noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
};

const DATA_GRID_SLOT_PROPS: DataGridProps['slotProps'] = {
  noRowsOverlay: { text: 'No fund applications found.' },
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
  initialFundApplications: FundApplicationDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function FundApplicationsList({ initialFundApplications, initialPaginationOptions }: Props) {
  const getFundApplications = useMemo(
    () => clientContainer.get<GetFundApplications>(SYMBOLS.GetFundApplications),
    [],
  );
  const deleteFundApplication = useMemo(
    () => clientContainer.get<DeleteFundApplication>(SYMBOLS.DeleteFundApplication),
    [],
  );
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = useUserPermissions();

  const convertSortModelToDomain = (
    model: GridSortModel,
  ): FundApplicationSortOptions | undefined => {
    if (model.length === 0) return undefined;

    const fieldMap: Record<string, keyof FundApplicationSortOptions> = {
      id: 'id',
      competitionBranch: 'competitionBranch',
      status: 'status',
    };

    const sortOptions: FundApplicationSortOptions = {};
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
  ): FundApplicationFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;

    const filterOptions: FundApplicationFilterOptions = {};

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
  } = useCursorDataGrid<FundApplication>({
    initialRows: () => initialFundApplications.map(FundApplicationMapper.fromDtoToDomain),
    initialRowCount: initialFundApplications.length,
    initialPaginationOptions,
    fetchPage: ({ filterModel, sortModel, pageSize, cursor, abortSignal }) => {
      const sortOptions = convertSortModelToDomain(sortModel);
      const filterOptions = convertFilterModelToDomain(filterModel);
      return getFundApplications.execute(
        ['team', 'team.members', 'competition_instance', 'competition_scale'],
        filterOptions,
        sortOptions,
        { perPage: pageSize, cursor },
        abortSignal,
      );
    },
    deleteRow: (id) => deleteFundApplication.execute(id),
    entityLabel: 'fund applications',
  });

  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      router.push(`/fund-applications/${params.row.id}`);
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
        field: 'competitionBranch',
        headerName: 'Branch',
        flex: 2,
        minWidth: 200,
        filterable: true,
        sortable: true,
        filterOperators: [StringOperators.contains],
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
        field: 'letterOfAcceptance',
        headerName: 'LoA',
        flex: 0.5,
        minWidth: 100,
        filterable: false,
        sortable: false,
      },
      {
        field: 'proposal',
        headerName: 'Proposal',
        flex: 0.5,
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
              href={`/fund-applications/${params.row.actions.id}`}
            />
            {['update-fund-application'].some((p) => userPermissions.has(p)) ||
            (['update-own-fund-application'].some((p) => userPermissions.has(p)) &&
              params.row.actions.team?.members?.some(
                (member: User) => member.id === userSession?.user?.id,
              )) ? (
              <GridActionsCellItem
                key="edit"
                showInMenu
                icon={<EditRounded />}
                label="Edit"
                component={Link}
                href={`/fund-applications/${params.row.actions.id}/edit`}
              />
            ) : null}
            {['delete-fund-application'].some((p) => userPermissions.has(p)) ||
            (['delete-own-fund-application'].some((p) => userPermissions.has(p)) &&
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
      rows.map((fundApplication) => ({
        id: fundApplication.id,
        team: fundApplication.team?.name || 'N/A',
        competition: fundApplication.competitionInstance?.name || 'N/A',
        competitionScale: fundApplication.competitionScale?.name || 'N/A',
        competitionBranch: fundApplication.competitionBranch,
        competitionStartDate: fundApplication.competitionStartDate.toLocaleDateString(),
        competitionEndDate: fundApplication.competitionEndDate.toLocaleDateString(),
        letterOfAcceptance: fundApplication.letterOfAcceptance,
        proposal: fundApplication.proposal,
        status: fundApplication.status,
        actions: fundApplication,
      })),
    [rows],
  );

  return (
    <>
      <SectionHeader title="Fund Applications">
        <FundApplicationsToolbar dataGridApiRef={dataGridApiRef} />
      </SectionHeader>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        onExited={handleDeleteDialogExited}
        isLoading={isDeleting}
        confirmColor="error"
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedName || 'this fund application'}? This action cannot be undone.`}
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
