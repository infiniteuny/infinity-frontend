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
  Permission,
  PermissionFilterOptions,
  PermissionSortOptions,
} from '@infiniteuny/infinity-domain';
import {
  PermissionDto,
  PermissionMapper,
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
import { DeletePermission, GetPermissions } from '@infiniteuny/infinity-application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { SYMBOLS } from '@config';
import { useCursorDataGrid, useUserPermissions } from '@app/presentation/hooks';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PermissionsToolbar } from './permissions-toolbar';

const DATA_GRID_SX: DataGridProps['sx'] = {
  '.MuiTablePagination-displayedRows': { display: 'none' },
  '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
};

const DATA_GRID_SLOTS: Partial<GridSlots> = {
  noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
};

const DATA_GRID_SLOT_PROPS: DataGridProps['slotProps'] = {
  noRowsOverlay: { text: 'No permissions found.' },
  loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' },
};

const DATA_GRID_PAGE_SIZE_OPTIONS = [25, 50, 100];

const DATA_GRID_INITIAL_STATE: DataGridProps['initialState'] = {
  columns: { columnVisibilityModel: { id: false } },
};

type Props = {
  initialPermissions: PermissionDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function PermissionsList({ initialPermissions, initialPaginationOptions }: Props) {
  const getPermissions = useMemo(
    () => clientContainer.get<GetPermissions>(SYMBOLS.GetPermissions),
    [],
  );
  const deletePermission = useMemo(
    () => clientContainer.get<DeletePermission>(SYMBOLS.DeletePermission),
    [],
  );
  const router = useRouter();
  const userPermissions = useUserPermissions();
  const convertSortModelToDomain = (model: GridSortModel): PermissionSortOptions | undefined => {
    if (model.length === 0) return undefined;
    const fieldMap: Record<string, keyof PermissionSortOptions> = { id: 'id', name: 'name' };
    const sortOptions: PermissionSortOptions = {};
    for (const sortItem of model) {
      const d = fieldMap[sortItem.field];
      if (d) sortOptions[d] = sortItem.sort === 'asc' ? 'ASC' : 'DESC';
    }
    return Object.keys(sortOptions).length > 0 ? sortOptions : undefined;
  };

  const convertFilterModelToDomain = (
    model: GridFilterModel,
  ): PermissionFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;
    const f: PermissionFilterOptions = {};
    for (const i of model.items) {
      if (i.field === 'name' && i.value != null) f.name = String(i.value);
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
    selectedName: selectedPermissionName,
    handleDeleteClick,
    handleDeleteAccept,
    handleDeleteCancel,
    handleDeleteDialogExited,
  } = useCursorDataGrid<Permission>({
    initialRows: () => initialPermissions.map(PermissionMapper.fromDtoToDomain),
    initialRowCount: initialPermissions.length,
    initialPaginationOptions,
    fetchPage: ({ filterModel, sortModel, pageSize, cursor, abortSignal }) =>
      getPermissions.execute(
        convertFilterModelToDomain(filterModel),
        convertSortModelToDomain(sortModel),
        { perPage: pageSize, cursor },
        abortSignal,
      ),
    deleteRow: (id) => deletePermission.execute(id),
    entityLabel: 'permissions',
  });

  const handleRowClick = useCallback(
    (p: GridRowParams) => {
      router.push(`/permissions/${p.row.id}`);
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
        flex: 3,
        minWidth: 200,
        filterable: true,
        sortable: true,
        filterOperators: [StringOperators.contains],
      },
      {
        field: 'guardName',
        headerName: 'Guard Name',
        flex: 1,
        minWidth: 120,
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
        renderCell: (p) => (
          <GridActionsCell {...p}>
            <GridActionsCellItem
              key="view"
              showInMenu
              icon={<VisibilityRounded />}
              label="View"
              component={Link}
              href={`/permissions/${p.row.actions.id}`}
            />
            {['update-permission'].some((x) => userPermissions.has(x)) ? (
              <GridActionsCellItem
                key="edit"
                showInMenu
                icon={<EditRounded />}
                label="Edit"
                component={Link}
                href={`/permissions/${p.row.actions.id}/edit`}
              />
            ) : null}
            {['delete-permission'].some((x) => userPermissions.has(x)) ? (
              <GridActionsCellItem
                key="delete"
                showInMenu
                icon={<DeleteRounded />}
                label="Delete"
                onClick={() => handleDeleteClick(p.row.actions.id, p.row.actions.name)}
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
      rows.map((x) => ({
        id: x.id,
        name: x.name,
        guardName: x.guardName,
        createdAt: x.createdAt.toLocaleDateString(),
        actions: x,
      })),
    [rows],
  );

  return (
    <>
      <SectionHeader title="Permissions">
        <PermissionsToolbar dataGridApiRef={dataGridApiRef} />
      </SectionHeader>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        onExited={handleDeleteDialogExited}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedPermissionName || 'this permission'}? This action cannot be undone.`}
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
