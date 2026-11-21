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
import { DeleteRounded, VisibilityRounded } from '@mui/icons-material';
import { DeleteUserPermission, GetUserPermissions } from '@infiniteuny/infinity-application';
import {
  PermissionFilterOptions,
  PermissionSortOptions,
  UserPermission,
} from '@infiniteuny/infinity-domain';
import {
  PaginationOptionsDto,
  UserDto,
  UserMapper,
  UserPermissionDto,
  UserPermissionMapper,
} from '@infiniteuny/infinity-infrastructure/dtos';
import { SYMBOLS } from '@config';
import { useCursorDataGrid, useUserPermissions } from '@app/presentation/hooks';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { UserPermissionsToolbar } from './user-permissions-toolbar';

const DATA_GRID_SX: DataGridProps['sx'] = {
  '.MuiTablePagination-displayedRows': { display: 'none' },
  '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
};

const DATA_GRID_SLOTS: Partial<GridSlots> = {
  noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
};

const DATA_GRID_SLOT_PROPS: DataGridProps['slotProps'] = {
  noRowsOverlay: { text: 'No user permissions found.' },
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
  initialUserPermissions: UserPermissionDto[];
  initialPaginationOptions: PaginationOptionsDto;
  user: UserDto;
  isProfileView?: boolean;
};

export function UserPermissionsList({
  initialUserPermissions,
  initialPaginationOptions,
  user,
  isProfileView,
}: Props) {
  const parsedUser = useMemo(() => UserMapper.fromDtoToDomain(user), [user]);
  const getUserPermissions = useMemo(
    () => clientContainer.get<GetUserPermissions>(SYMBOLS.GetUserPermissions),
    [],
  );
  const deleteUserPermission = useMemo(
    () => clientContainer.get<DeleteUserPermission>(SYMBOLS.DeleteUserPermission),
    [],
  );
  const router = useRouter();
  const userPermissions = useUserPermissions();

  const convertSortModelToDomain = (model: GridSortModel): PermissionSortOptions | undefined => {
    if (model.length === 0) return undefined;

    const fieldMap: Record<string, keyof PermissionSortOptions> = {
      id: 'id',
      name: 'name',
      guardName: 'guardName',
    };

    const sortOptions: PermissionSortOptions = {};
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
  ): PermissionFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;

    const filterOptions: PermissionFilterOptions = {};

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
    selectedName,
    isDeleting,
    handleDeleteClick,
    handleDeleteAccept,
    handleDeleteCancel,
    handleDeleteDialogExited,
  } = useCursorDataGrid<UserPermission>({
    initialRows: () => initialUserPermissions.map(UserPermissionMapper.fromDtoToDomain),
    initialRowCount: initialUserPermissions.length,
    initialPaginationOptions,
    fetchPage: ({ filterModel, sortModel, pageSize, cursor }) => {
      const sortOptions = convertSortModelToDomain(sortModel);
      const filterOptions = convertFilterModelToDomain(filterModel);
      return getUserPermissions.execute(parsedUser.id, filterOptions, sortOptions, {
        perPage: pageSize,
        cursor,
      });
    },
    deleteRow: (id) => deleteUserPermission.execute(id),
    entityLabel: 'user permissions',
  });

  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      router.push(`/permissions/${params.row.id}`);
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
        renderCell: (params) => (
          <GridActionsCell {...params}>
            <GridActionsCellItem
              key="view"
              showInMenu
              icon={<VisibilityRounded />}
              label="View"
              component={Link}
              href={`/permissions/${params.row.actions.id}`}
            />
            {['delete-user-permission'].some((p) => userPermissions.has(p)) ? (
              <GridActionsCellItem
                key="delete"
                showInMenu
                icon={<DeleteRounded />}
                label="Delete"
                onClick={() =>
                  handleDeleteClick(params.row.actions.entitlement.id, params.row.actions.name)
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
      rows.map((userPermission) => ({
        id: userPermission.id,
        name: userPermission.name,
        guardName: userPermission.guardName,
        actions: userPermission,
      })),
    [rows],
  );

  return (
    <>
      <SectionHeader
        title={`${parsedUser.name}'s Permissions`}
        backUrl={isProfileView ? `/settings/profile` : `/users/${parsedUser.id}`}
      >
        <UserPermissionsToolbar
          userId={parsedUser.id}
          dataGridApiRef={dataGridApiRef}
          isProfileView={isProfileView}
        />
      </SectionHeader>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        onExited={handleDeleteDialogExited}
        isLoading={isDeleting}
        confirmColor="error"
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedName || 'this permission'}? This action cannot be undone.`}
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
