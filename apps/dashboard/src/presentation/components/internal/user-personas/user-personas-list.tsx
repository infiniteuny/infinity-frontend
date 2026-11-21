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
import { DeleteUserPersona, GetUserPersonas } from '@infiniteuny/infinity-application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import {
  PersonaFilterOptions,
  PersonaSortOptions,
  UserPersona,
} from '@infiniteuny/infinity-domain';
import {
  PaginationOptionsDto,
  UserDto,
  UserMapper,
  UserPersonaDto,
  UserPersonaMapper,
} from '@infiniteuny/infinity-infrastructure';
import { SYMBOLS } from '@config';
import { useCursorDataGrid, useInternalStore, useUserPermissions } from '@app/presentation/hooks';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { UserPersonasToolbar } from './user-personas-toolbar';

const DATA_GRID_SX: DataGridProps['sx'] = {
  '.MuiTablePagination-displayedRows': {
    display: 'none',
  },
  '.MuiDataGrid-row': {
    '&:hover': {
      cursor: 'pointer',
    },
  },
};

const DATA_GRID_SLOTS: Partial<GridSlots> = {
  noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
};

const DATA_GRID_SLOT_PROPS: DataGridProps['slotProps'] = {
  noRowsOverlay: { text: 'No user personas found.' },
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
  initialUserPersonas: UserPersonaDto[];
  initialPaginationOptions: PaginationOptionsDto;
  user: UserDto;
  isProfileView?: boolean;
};

export function UserPersonasList({
  initialUserPersonas,
  initialPaginationOptions,
  user,
  isProfileView,
}: Props) {
  const parsedUser = useMemo(() => UserMapper.fromDtoToDomain(user), [user]);
  const getUserPersonas = useMemo(
    () => clientContainer.get<GetUserPersonas>(SYMBOLS.GetUserPersonas),
    [],
  );
  const deleteUserPersona = useMemo(
    () => clientContainer.get<DeleteUserPersona>(SYMBOLS.DeleteUserPersona),
    [],
  );
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = useUserPermissions();

  const convertSortModelToDomain = (model: GridSortModel): PersonaSortOptions | undefined => {
    if (model.length === 0) return undefined;

    const fieldMap: Record<string, keyof PersonaSortOptions> = {
      id: 'id',
      name: 'name',
      priority: 'priority',
    };

    const sortOptions: PersonaSortOptions = {};
    for (const sortItem of model) {
      const domainField = fieldMap[sortItem.field];
      if (domainField) {
        sortOptions[domainField] = sortItem.sort === 'asc' ? 'ASC' : 'DESC';
      }
    }

    return Object.keys(sortOptions).length > 0 ? sortOptions : undefined;
  };

  const convertFilterModelToDomain = (model: GridFilterModel): PersonaFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;

    const filterOptions: PersonaFilterOptions = {};

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
    selectedName: selectedUserPersonaName,
    isDeleting,
    handleDeleteClick,
    handleDeleteAccept,
    handleDeleteCancel,
    handleDeleteDialogExited,
  } = useCursorDataGrid<UserPersona>({
    initialRows: () => initialUserPersonas.map(UserPersonaMapper.fromDtoToDomain),
    initialRowCount: initialUserPersonas.length,
    initialPaginationOptions,
    fetchPage: ({ filterModel, sortModel, pageSize, cursor }) => {
      const sortOptions = convertSortModelToDomain(sortModel);
      const filterOptions = convertFilterModelToDomain(filterModel);
      return getUserPersonas.execute(parsedUser.id, filterOptions, sortOptions, {
        perPage: pageSize,
        cursor,
      });
    },
    deleteRow: (id) => deleteUserPersona.execute(id),
    entityLabel: 'user personas',
  });

  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      router.push(`/personas/${params.row.id}`);
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
        field: 'priority',
        headerName: 'Priority',
        flex: 1,
        minWidth: 100,
        filterable: false,
        sortable: true,
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 3,
        minWidth: 400,
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
              href={`/personas/${params.row.actions.id}`}
            />
            {['update-user-persona'].some((p) => userPermissions.has(p)) ||
            (['update-own-user-persona'].some((p) => userPermissions.has(p)) &&
              parsedUser.id === userSession?.user?.id) ? (
              <GridActionsCellItem
                key="edit"
                showInMenu
                icon={<EditRounded />}
                label="Edit"
                component={Link}
                href={`/personas/${params.row.actions.id}/edit`}
              />
            ) : null}
            {['delete-user-persona'].some((p) => userPermissions.has(p)) ||
            (['delete-own-user-persona'].some((p) => userPermissions.has(p)) &&
              parsedUser.id === userSession?.user?.id) ? (
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
    [userPermissions, userSession?.user?.id, parsedUser.id, handleDeleteClick],
  );

  const gridRows = useMemo(
    () =>
      rows.map((userPersona) => ({
        id: userPersona.id,
        name: userPersona.name,
        priority: userPersona.priority,
        description: userPersona.description,
        actions: userPersona,
      })),
    [rows],
  );

  return (
    <>
      <SectionHeader
        title={`${parsedUser.name}'s Personas`}
        backUrl={isProfileView ? '/settings/profile' : `/users/${parsedUser.id}`}
      >
        <UserPersonasToolbar
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
        description={`Are you sure you want to permanently delete ${selectedUserPersonaName || 'this persona'}? This action cannot be undone.`}
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
