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
  CompetitionTeamType,
  CompetitionTeamTypeFilterOptions,
  CompetitionTeamTypeSortOptions,
} from '@infiniteuny/infinity-domain';
import {
  CompetitionTeamTypeDto,
  CompetitionTeamTypeMapper,
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
  DeleteCompetitionTeamType,
  GetCompetitionTeamTypes,
} from '@infiniteuny/infinity-application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { SYMBOLS } from '@config';
import { useCursorDataGrid, useUserPermissions } from '@app/presentation/hooks';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CompetitionTeamTypesToolbar } from './competition-team-types-toolbar';

const DATA_GRID_SX: DataGridProps['sx'] = {
  '.MuiTablePagination-displayedRows': { display: 'none' },
  '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
};

const DATA_GRID_SLOTS: Partial<GridSlots> = {
  noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
};

const DATA_GRID_SLOT_PROPS: DataGridProps['slotProps'] = {
  noRowsOverlay: { text: 'No competition team types found.' },
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
  const router = useRouter();
  const userPermissions = useUserPermissions();

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
    selectedName: selectedTeamTypeName,
    handleDeleteClick,
    handleDeleteAccept,
    handleDeleteCancel,
    handleDeleteDialogExited,
  } = useCursorDataGrid<CompetitionTeamType>({
    initialRows: () => initialCompetitionTeamTypes.map(CompetitionTeamTypeMapper.fromDtoToDomain),
    initialRowCount: initialCompetitionTeamTypes.length,
    initialPaginationOptions,
    fetchPage: ({ filterModel, sortModel, pageSize, cursor, abortSignal }) => {
      const sortOptions = convertSortModelToDomain(sortModel);
      const filterOptions = convertFilterModelToDomain(filterModel);
      return getCompetitionTeamTypes.execute(
        filterOptions,
        sortOptions,
        {
          perPage: pageSize,
          cursor,
        },
        abortSignal,
      );
    },
    deleteRow: (id) => deleteCompetitionTeamType.execute(id),
    entityLabel: 'competition team types',
  });

  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      router.push(`/team-types/${params.row.id}`);
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
              href={`/team-types/${params.row.actions.id}`}
            />
            {['update-competition-team-type'].some((p) => userPermissions.has(p)) ? (
              <GridActionsCellItem
                key="edit"
                showInMenu
                icon={<EditRounded />}
                label="Edit"
                component={Link}
                href={`/team-types/${params.row.actions.id}/edit`}
              />
            ) : null}
            {['delete-competition-team-type'].some((p) => userPermissions.has(p)) ? (
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
      rows.map((teamType) => ({
        id: teamType.id,
        name: teamType.name,
        weight: teamType.weight,
        actions: teamType,
      })),
    [rows],
  );

  return (
    <>
      <SectionHeader title="Team Types" backUrl="/settings">
        <CompetitionTeamTypesToolbar dataGridApiRef={dataGridApiRef} />
      </SectionHeader>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        onExited={handleDeleteDialogExited}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedTeamTypeName || 'this team type'}? This action cannot be undone.`}
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
