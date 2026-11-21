'use client';

import Link from 'next/link';
import {
  AlertDialog,
  BooleanOperators,
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
  GridPaginationMeta,
  GridPaginationModel,
  GridRowParams,
  GridSlots,
  GridSortModel,
  useGridApiRef,
} from '@mui/x-data-grid';
import {
  DeleteCommunityGroupMember,
  GetUserCommunityGroups,
} from '@infiniteuny/infinity-application';
import { DeleteRounded, VisibilityRounded } from '@mui/icons-material';
import { match } from 'effect/Either';
import {
  CommunityGroupFilterOptions,
  CommunityGroupSortOptions,
  PaginationOptions,
  UserCommunityGroup,
} from '@infiniteuny/infinity-domain';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserDto,
  UserMapper,
  UserCommunityGroupDto,
  UserCommunityGroupMapper,
} from '@infiniteuny/infinity-infrastructure';
import { SYMBOLS } from '@config';
import { useInternalStore, useUserPermissions } from '@app/presentation/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCommunityGroupsToolbar } from './user-community-groups-toolbar';

const DATA_GRID_SX: DataGridProps['sx'] = {
  '.MuiTablePagination-displayedRows': { display: 'none' },
  '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
};

const DATA_GRID_SLOTS: Partial<GridSlots> = {
  noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
};

const DATA_GRID_SLOT_PROPS: DataGridProps['slotProps'] = {
  noRowsOverlay: { text: 'No user community groups found.' },
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
  initialUserCommunityGroups: UserCommunityGroupDto[];
  initialPaginationOptions: PaginationOptionsDto;
  user: UserDto;
  isProfileView?: boolean;
};

export function UserCommunityGroupsList({
  initialUserCommunityGroups,
  initialPaginationOptions,
  user,
  isProfileView,
}: Props) {
  const getUserCommunityGroups = useMemo(
    () => clientContainer.get<GetUserCommunityGroups>(SYMBOLS.GetUserCommunityGroups),
    [],
  );
  const deleteCommunityGroupMember = useMemo(
    () => clientContainer.get<DeleteCommunityGroupMember>(SYMBOLS.DeleteCommunityGroupMember),
    [],
  );
  const parsedUser = useMemo(() => UserMapper.fromDtoToDomain(user), [user]);
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = useUserPermissions();

  const [initPaginationOptions] = useState(() =>
    PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions),
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<UserCommunityGroup[]>(() =>
    initialUserCommunityGroups.map(UserCommunityGroupMapper.fromDtoToDomain),
  );
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initialUserCommunityGroups.length,
  );
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: initPaginationOptions.previousCursor ? 1 : 0,
    pageSize: initPaginationOptions.perPage || 25,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [paginationMeta, setPaginationMeta] = useState<GridPaginationMeta>({
    hasNextPage: Boolean(initPaginationOptions.nextCursor),
  });
  const [paginationOptions, setPaginationOptions] =
    useState<Pick<PaginationOptions, 'cursor' | 'nextCursor' | 'previousCursor'>>(
      initPaginationOptions,
    );
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const isInitialMount = useRef(true);
  const lastFetchedStateRef = useRef<string>(
    JSON.stringify({
      filters: [],
      sort: [],
      pagination: {
        page: initPaginationOptions.previousCursor ? 1 : 0,
        pageSize: initPaginationOptions.perPage || 25,
      },
    }),
  );
  const dataGridApiRef = useGridApiRef();

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedUserCommunityGroupId, setSelectedUserCommunityGroupId] = useState<string | null>(
    null,
  );
  const [selectedUserCommunityGroupName, setSelectedUserCommunityGroupName] = useState<
    string | null
  >(null);

  const convertSortModelToDomain = (
    model: GridSortModel,
  ): CommunityGroupSortOptions | undefined => {
    if (model.length === 0) return undefined;

    const fieldMap: Record<string, keyof CommunityGroupSortOptions> = {
      id: 'id',
      name: 'name',
      priority: 'priority',
      isActive: 'isActive',
    };

    const sortOptions: CommunityGroupSortOptions = {};
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
  ): CommunityGroupFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;

    const filterOptions: CommunityGroupFilterOptions = {};

    for (const filterItem of model.items) {
      switch (filterItem.field) {
        case 'name':
          if (filterItem.value != null) {
            filterOptions.name = String(filterItem.value);
          }
          break;
        case 'isActive':
          if (filterItem.value != null) {
            filterOptions.isActive = Boolean(filterItem.value);
          }
          break;
      }
    }

    return Object.keys(filterOptions).length > 0 ? filterOptions : undefined;
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const stateString = JSON.stringify({
      filters: filterModel.items
        .filter((item) => item.value != null && item.value !== '')
        .map((item) => ({ field: item.field, value: item.value })),
      sort: sortModel,
      pagination: paginationModel,
    });

    if (stateString === lastFetchedStateRef.current) {
      return;
    } else {
      lastFetchedStateRef.current = stateString;
    }

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      const sortOptions = convertSortModelToDomain(sortModel);
      const filterOptions = convertFilterModelToDomain(filterModel);

      try {
        const result = await getUserCommunityGroups.execute(
          parsedUser.id,
          filterOptions,
          sortOptions,
          {
            perPage: paginationModel.pageSize,
            cursor,
          },
        );

        if (cancelled) return;

        match(result, {
          onRight: ([newRows, nextPaginationOptions]) => {
            const hasNextPage = Boolean(nextPaginationOptions.nextCursor);

            setRows(newRows);
            setRowCount(
              hasNextPage ? -1 : paginationModel.page * paginationModel.pageSize + newRows.length,
            );
            setPaginationMeta({ hasNextPage });
            setPaginationOptions(nextPaginationOptions);
          },
          onLeft: (error) => {
            throw error;
          },
        });
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [paginationModel, sortModel, filterModel, cursor, getUserCommunityGroups, parsedUser.id]);

  const handlePaginationModelChange = useCallback(
    (newPaginationModel: GridPaginationModel) => {
      const isPageSizeChanged = newPaginationModel.pageSize !== paginationModel.pageSize;
      const normalizedPaginationModel = isPageSizeChanged
        ? { ...newPaginationModel, page: 0 }
        : newPaginationModel;

      let nextCursor: string | undefined;
      if (isPageSizeChanged) {
        nextCursor = undefined;
      } else if (
        normalizedPaginationModel.page > paginationModel.page &&
        paginationOptions.nextCursor
      ) {
        nextCursor = paginationOptions.nextCursor;
      } else if (
        normalizedPaginationModel.page < paginationModel.page &&
        paginationOptions.previousCursor
      ) {
        nextCursor = paginationOptions.previousCursor;
      } else {
        nextCursor = paginationOptions.cursor;
      }

      setCursor(nextCursor);
      setPaginationModel(normalizedPaginationModel);
    },
    [paginationModel, paginationOptions],
  );

  const handleSortModelChange = useCallback((newSortModel: GridSortModel) => {
    setCursor(undefined);
    setPaginationModel((prev) => ({ page: 0, pageSize: prev.pageSize }));
    setSortModel(newSortModel);
  }, []);

  const handleFilterModelChange = useCallback((newFilterModel: GridFilterModel) => {
    setCursor(undefined);
    setPaginationModel((prev) => ({ page: 0, pageSize: prev.pageSize }));
    setFilterModel(newFilterModel);
  }, []);

  const handleDeleteClick = useCallback(
    (userCommunityGroupId: string, userCommunityGroupName?: string) => {
      setSelectedUserCommunityGroupId(userCommunityGroupId);
      setSelectedUserCommunityGroupName(userCommunityGroupName || null);
      setOpenDeleteDialog(true);
    },
    [],
  );

  const handleDeleteAccept = async () => {
    if (!selectedUserCommunityGroupId) {
      console.error('No user community group selected for deletion');

      return;
    }

    const selectedRow = rows.find((row) => row.id === selectedUserCommunityGroupId);
    const membershipId = selectedRow?.membership?.id;
    if (!membershipId) {
      console.error('No membership ID found for the selected community group');

      return;
    }

    const result = await deleteCommunityGroupMember.execute(membershipId);
    match(result, {
      onRight: () => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedUserCommunityGroupId));
      },
      onLeft: (error) => {
        console.error('Failed to delete user community group:', error);
      },
    });

    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedUserCommunityGroupId(null);
      setSelectedUserCommunityGroupName(null);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedUserCommunityGroupId(null);
      setSelectedUserCommunityGroupName(null);
    }, 1000);
  };

  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      router.push(`/community-groups/${params.row.id}`);
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
        field: 'priority',
        headerName: 'Priority',
        flex: 1,
        minWidth: 100,
        filterable: false,
        sortable: true,
      },
      {
        field: 'isActive',
        headerName: 'Active',
        type: 'boolean',
        flex: 1,
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
              href={`/community-groups/${params.row.actions.id}`}
            />
            {['delete-community-group-member'].some((p) => userPermissions.has(p)) ||
            (['delete-own-community-group-member'].some((p) => userPermissions.has(p)) &&
              parsedUser.id === userSession?.user?.id) ? (
              <GridActionsCellItem
                key="delete"
                showInMenu
                icon={<DeleteRounded />}
                label="Delete"
                onClick={() =>
                  handleDeleteClick(params.row.actions.membership.id, params.row.actions.name)
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
      rows.map((userCommunityGroup) => ({
        id: userCommunityGroup.id,
        name: userCommunityGroup.name,
        priority: userCommunityGroup.priority,
        isActive: userCommunityGroup.isActive,
        actions: userCommunityGroup,
      })),
    [rows],
  );

  return (
    <>
      <SectionHeader
        title={`${parsedUser.name}'s Community Groups`}
        backUrl={isProfileView ? `/settings/profile` : `/users/${parsedUser.id}`}
      >
        <UserCommunityGroupsToolbar
          userId={parsedUser.id}
          dataGridApiRef={dataGridApiRef}
          isProfileView={isProfileView}
        />
      </SectionHeader>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedUserCommunityGroupName || 'this community group membership'}? This action cannot be undone.`}
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
