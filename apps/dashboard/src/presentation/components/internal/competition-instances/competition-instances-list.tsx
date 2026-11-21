'use client';

import Link from 'next/link';
import {
  AlertDialog,
  CompetitionFilterInput,
  CompetitionOrganizerTypeFilterInput,
  DateOperators,
  SectionHeader,
  EmptyRowOverlay,
  StringOperators,
} from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  CompetitionInstance,
  CompetitionInstanceFilterOptions,
  CompetitionInstanceSortOptions,
  FilterOperator,
} from '@infiniteuny/infinity-domain';
import {
  CompetitionInstanceDto,
  CompetitionInstanceMapper,
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
import {
  DeleteCompetitionInstance,
  GetCompetitionInstances,
} from '@infiniteuny/infinity-application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { SYMBOLS } from '@config';
import { useCursorDataGrid, useUserPermissions } from '@app/presentation/hooks';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { convertDateFilterOperator } from '@infiniteuny/infinity-utils';
import { CompetitionInstancesToolbar } from './competition-instances-toolbar';

const DATA_GRID_SX: DataGridProps['sx'] = {
  '.MuiTablePagination-displayedRows': { display: 'none' },
  '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
};

const DATA_GRID_SLOTS: Partial<GridSlots> = {
  noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
};

const DATA_GRID_SLOT_PROPS: DataGridProps['slotProps'] = {
  noRowsOverlay: { text: 'No competitions found.' },
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
      competition: false,
    },
  },
};

type Props = {
  initialCompetitionInstances: CompetitionInstanceDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function CompetitionInstancesList({
  initialCompetitionInstances,
  initialPaginationOptions,
}: Props) {
  const getCompetitionInstances = useMemo(
    () => clientContainer.get<GetCompetitionInstances>(SYMBOLS.GetCompetitionInstances),
    [],
  );
  const deleteCompetitionInstance = useMemo(
    () => clientContainer.get<DeleteCompetitionInstance>(SYMBOLS.DeleteCompetitionInstance),
    [],
  );
  const router = useRouter();
  const userPermissions = useUserPermissions();

  const convertSortModelToDomain = (
    model: GridSortModel,
  ): CompetitionInstanceSortOptions | undefined => {
    if (model.length === 0) return undefined;

    const fieldMap: Record<string, keyof CompetitionInstanceSortOptions> = {
      id: 'id',
      name: 'name',
      shortname: 'shortname',
      organizer: 'organizer',
      location: 'location',
      startDate: 'startDate',
      endDate: 'endDate',
    };

    const sortOptions: CompetitionInstanceSortOptions = {};
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
  ): CompetitionInstanceFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;

    const filterOptions: CompetitionInstanceFilterOptions = {};

    for (const filterItem of model.items) {
      switch (filterItem.field) {
        case 'name':
          if (filterItem.value != null) {
            filterOptions.name = String(filterItem.value);
          }
          break;
        case 'competition':
          if (filterItem.value != null) {
            filterOptions.competitionId = String(filterItem.value);
          }
          break;
        case 'organizer':
          if (filterItem.value != null) {
            filterOptions.organizer = String(filterItem.value);
          }
          break;
        case 'location':
          if (filterItem.value != null) {
            filterOptions.location = String(filterItem.value);
          }
          break;
        case 'organizerType':
          if (filterItem.value != null) {
            filterOptions.organizerTypeId = String(filterItem.value);
          }
          break;
        case 'startDate':
          if (filterItem.operator === 'isEmpty') {
            filterOptions.startDateOperator = FilterOperator.EQUAL;
            filterOptions.startDate = undefined;
          } else if (filterItem.operator === 'isNotEmpty') {
            filterOptions.startDateOperator = FilterOperator.NOT_EQUAL;
            filterOptions.startDate = undefined;
          } else if (filterItem.value != null) {
            filterOptions.startDate =
              filterItem.value instanceof Date ? filterItem.value : new Date(filterItem.value);
            filterOptions.startDateOperator = convertDateFilterOperator(filterItem.operator);
          }
          break;
        case 'endDate':
          if (filterItem.operator === 'isEmpty') {
            filterOptions.endDateOperator = FilterOperator.EQUAL;
            filterOptions.endDate = undefined;
          } else if (filterItem.operator === 'isNotEmpty') {
            filterOptions.endDateOperator = FilterOperator.NOT_EQUAL;
            filterOptions.endDate = undefined;
          } else if (filterItem.value != null) {
            filterOptions.endDate =
              filterItem.value instanceof Date ? filterItem.value : new Date(filterItem.value);
            filterOptions.endDateOperator = convertDateFilterOperator(filterItem.operator);
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
    selectedName: selectedCompetitionInstanceName,
    handleDeleteClick,
    handleDeleteAccept,
    handleDeleteCancel,
    handleDeleteDialogExited,
  } = useCursorDataGrid<CompetitionInstance>({
    initialRows: () => initialCompetitionInstances.map(CompetitionInstanceMapper.fromDtoToDomain),
    initialRowCount: initialCompetitionInstances.length,
    initialPaginationOptions,
    fetchPage: ({ filterModel, sortModel, pageSize, cursor }) => {
      const sortOptions = convertSortModelToDomain(sortModel);
      const filterOptions = convertFilterModelToDomain(filterModel);
      return getCompetitionInstances.execute(
        ['competition', 'organizer_type'],
        filterOptions,
        sortOptions,
        { perPage: pageSize, cursor },
      );
    },
    deleteRow: (id) => deleteCompetitionInstance.execute(id),
    entityLabel: 'competition instances',
  });

  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      router.push(`/competitions/${params.row.id}`);
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
        minWidth: 300,
        filterable: true,
        sortable: true,
        filterOperators: [StringOperators.contains],
      },
      {
        field: 'shortname',
        headerName: 'Shortname',
        flex: 1,
        minWidth: 120,
        filterable: false,
        sortable: true,
      },
      {
        field: 'competition',
        headerName: 'Series',
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
            InputComponent: CompetitionFilterInput,
          },
        ],
      },
      {
        field: 'organizer',
        headerName: 'Organizer',
        flex: 2,
        minWidth: 200,
        filterable: true,
        sortable: true,
        filterOperators: [StringOperators.contains],
      },
      {
        field: 'organizerType',
        headerName: 'Organizer Type',
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
            InputComponent: CompetitionOrganizerTypeFilterInput,
          },
        ],
      },
      {
        field: 'location',
        headerName: 'Location',
        flex: 2,
        minWidth: 200,
        filterable: true,
        sortable: true,
        filterOperators: [StringOperators.contains],
      },
      {
        field: 'startDate',
        type: 'date',
        headerName: 'Start Date',
        flex: 1,
        minWidth: 100,
        filterable: true,
        sortable: true,
        filterOperators: [
          DateOperators.is,
          DateOperators.not,
          DateOperators.after,
          DateOperators.onOrAfter,
          DateOperators.before,
          DateOperators.onOrBefore,
          DateOperators.isEmpty,
          DateOperators.isNotEmpty,
        ],
      },
      {
        field: 'endDate',
        type: 'date',
        headerName: 'End Date',
        flex: 1,
        minWidth: 100,
        filterable: true,
        sortable: true,
        filterOperators: [
          DateOperators.is,
          DateOperators.not,
          DateOperators.after,
          DateOperators.onOrAfter,
          DateOperators.before,
          DateOperators.onOrBefore,
          DateOperators.isEmpty,
          DateOperators.isNotEmpty,
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
              href={`/competitions/${params.row.actions.id}`}
            />
            {['update-competition'].some((p) => userPermissions.has(p)) ? (
              <GridActionsCellItem
                key="edit"
                showInMenu
                icon={<EditRounded />}
                label="Edit"
                component={Link}
                href={`/competitions/${params.row.actions.id}/edit`}
              />
            ) : null}
            {['delete-competition'].some((p) => userPermissions.has(p)) ? (
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
    [userPermissions, handleDeleteClick],
  );

  const gridRows = useMemo(
    () =>
      rows.map((instance) => ({
        id: instance.id,
        name: instance.name,
        shortname: instance.shortname,
        competition: instance.competition?.name || 'N/A',
        organizer: instance.organizer,
        organizerType: instance.organizerType?.name || 'N/A',
        location: instance.location,
        startDate: instance.startDate,
        endDate: instance.endDate,
        actions: instance,
      })),
    [rows],
  );

  return (
    <>
      <SectionHeader title="Competitions">
        <CompetitionInstancesToolbar dataGridApiRef={dataGridApiRef} />
      </SectionHeader>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        onExited={handleDeleteDialogExited}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedCompetitionInstanceName || 'this competition'}? This action cannot be undone.`}
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
