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
import {
  CommunityGroupAdmin,
  CommunityGroupAdminFilterOptions,
  CommunityGroupAdminSortOptions,
} from '@infiniteuny/infinity-domain';
import {
  CommunityGroupAdminDto,
  CommunityGroupAdminMapper,
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
  DeleteCommunityGroupAdmin,
  GetCommunityGroupAdmins,
} from '@infiniteuny/infinity-application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { SYMBOLS } from '@config';
import { useCursorDataGrid, useUserPermissions } from '@app/presentation/hooks';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CommunityGroupAdminsToolbar } from './community-group-admins-toolbar';

const DATA_GRID_SX: DataGridProps['sx'] = {
  '.MuiTablePagination-displayedRows': { display: 'none' },
  '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
};

const DATA_GRID_SLOTS: Partial<GridSlots> = {
  noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
};

const DATA_GRID_SLOT_PROPS: DataGridProps['slotProps'] = {
  noRowsOverlay: { text: 'No community group administrators found.' },
  loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' },
};

const DATA_GRID_PAGE_SIZE_OPTIONS = [25, 50, 100];

const DATA_GRID_INITIAL_STATE: DataGridProps['initialState'] = {
  columns: { columnVisibilityModel: { id: false, group: false } },
};

type Props = {
  initialCommunityGroupAdmins: CommunityGroupAdminDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function CommunityGroupAdminsList({
  initialCommunityGroupAdmins,
  initialPaginationOptions,
}: Props) {
  const getCommunityGroupAdmins = useMemo(
    () => clientContainer.get<GetCommunityGroupAdmins>(SYMBOLS.GetCommunityGroupAdmins),
    [],
  );
  const deleteCommunityGroupAdmin = useMemo(
    () => clientContainer.get<DeleteCommunityGroupAdmin>(SYMBOLS.DeleteCommunityGroupAdmin),
    [],
  );
  const router = useRouter();
  const userPermissions = useUserPermissions();
  const convertSortModelToDomain = (
    model: GridSortModel,
  ): CommunityGroupAdminSortOptions | undefined => {
    if (model.length === 0) return undefined;
    const fieldMap: Record<string, keyof CommunityGroupAdminSortOptions> = {
      id: 'id',
      year: 'year',
      isActive: 'isActive',
    };
    const sortOptions: CommunityGroupAdminSortOptions = {};
    for (const sortItem of model) {
      const d = fieldMap[sortItem.field];
      if (d) sortOptions[d] = sortItem.sort === 'asc' ? 'ASC' : 'DESC';
    }
    return Object.keys(sortOptions).length > 0 ? sortOptions : undefined;
  };

  const convertFilterModelToDomain = (
    model: GridFilterModel,
  ): CommunityGroupAdminFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;
    const f: CommunityGroupAdminFilterOptions = {};
    for (const i of model.items) {
      if (i.field === 'isActive' && i.value != null) f.isActive = Boolean(i.value);
    }
    return Object.keys(f).length > 0 ? f : undefined;
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
    selectedName: selectedCommunityGroupAdminYear,
    isDeleting,
    handleDeleteClick,
    handleDeleteAccept,
    handleDeleteCancel,
    handleDeleteDialogExited,
  } = useCursorDataGrid<CommunityGroupAdmin>({
    initialRows: () => initialCommunityGroupAdmins.map(CommunityGroupAdminMapper.fromDtoToDomain),
    initialRowCount: initialCommunityGroupAdmins.length,
    initialPaginationOptions,
    fetchPage: ({ filterModel, sortModel, pageSize, cursor }) =>
      getCommunityGroupAdmins.execute(
        convertFilterModelToDomain(filterModel),
        convertSortModelToDomain(sortModel),
        { perPage: pageSize, cursor },
      ),
    deleteRow: (id) => deleteCommunityGroupAdmin.execute(id),
    entityLabel: 'community group admins',
  });

  const handleRowClick = useCallback(
    (p: GridRowParams) => {
      router.push(`/community-group-admins/${p.row.id}`);
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
        renderCell: (p) => (
          <GridActionsCell {...p}>
            <GridActionsCellItem
              key="view"
              showInMenu
              icon={<VisibilityRounded />}
              label="View"
              component={Link}
              href={`/community-group-admins/${p.row.actions.id}`}
            />
            {['update-community-group-admin'].some((x) => userPermissions.has(x)) ? (
              <GridActionsCellItem
                key="edit"
                showInMenu
                icon={<EditRounded />}
                label="Edit"
                component={Link}
                href={`/community-group-admins/${p.row.actions.id}/edit`}
              />
            ) : null}
            {['delete-community-group-admin'].some((x) => userPermissions.has(x)) ? (
              <GridActionsCellItem
                key="delete"
                showInMenu
                icon={<DeleteRounded />}
                label="Delete"
                onClick={() => handleDeleteClick(p.row.actions.id, `${p.row.actions.year}`)}
              />
            ) : null}
          </GridActionsCell>
        ),
      },
    ],
    [userPermissions, handleDeleteClick],
  );

  const gridRows = useMemo(
    () => rows.map((x) => ({ id: x.id, year: x.year, isActive: x.isActive, actions: x })),
    [rows],
  );

  return (
    <>
      <SectionHeader title="Community Group Admins">
        <CommunityGroupAdminsToolbar dataGridApiRef={dataGridApiRef} />
      </SectionHeader>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        onExited={handleDeleteDialogExited}
        isLoading={isDeleting}
        confirmColor="error"
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedCommunityGroupAdminYear || 'this community group administrator'}? This action cannot be undone.`}
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
