'use client';

import Link from 'next/link';
import { AlertDialog, EmptyRowOverlay } from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  DataGrid,
  GridSlots,
  GridPaginationModel,
  GridPaginationMeta,
  GridRowParams,
  GridActionsCellItem,
  GridActionsCell,
} from '@mui/x-data-grid';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { DeleteUser, GetUsers } from '@app/application';
import { Major, PaginationOptions, User } from '@app/domain/entities';
import { match } from 'effect/Either';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserDto,
  UserMapper,
} from '@app/infrastructure/dtos';
import { SYMBOLS } from '@config';
import { useInternalStore } from '@app/presentation/hooks';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  initialUsers: UserDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function UsersList({ initialUsers, initialPaginationOptions }: Props) {
  const initUsers = initialUsers.map(UserMapper.fromDtoToDomain);
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const getUsers = useMemo(() => clientContainer.get<GetUsers>(SYMBOLS.GetUsers), []);
  const deleteUser = useMemo(() => clientContainer.get<DeleteUser>(SYMBOLS.DeleteUser), []);
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = new Set(userSession?.permissions || []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<User[]>(initUsers);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initUsers.length,
  );
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: initPaginationOptions.previousCursor ? 1 : 0,
    pageSize: initPaginationOptions.perPage || 25,
  });
  const [paginationMeta, setPaginationMeta] = useState<GridPaginationMeta>({
    hasNextPage: Boolean(initPaginationOptions.nextCursor),
  });
  const [paginationOptions, setPaginationOptions] =
    useState<Pick<PaginationOptions, 'cursor' | 'nextCursor' | 'previousCursor'>>(
      initPaginationOptions,
    );

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handlePaginationModelChange = async (newPaginationModel: GridPaginationModel) => {
    const isPageSizeChanged = newPaginationModel.pageSize !== paginationModel.pageSize;
    const normalizedPaginationModel = isPageSizeChanged
      ? { ...newPaginationModel, page: 0 }
      : newPaginationModel;

    setIsLoading(true);

    let cursor: string | undefined;
    if (isPageSizeChanged) {
      cursor = undefined;
    } else if (
      normalizedPaginationModel.page > paginationModel.page &&
      paginationOptions.nextCursor
    ) {
      cursor = paginationOptions.nextCursor;
    } else if (
      normalizedPaginationModel.page < paginationModel.page &&
      paginationOptions.previousCursor
    ) {
      cursor = paginationOptions.previousCursor;
    } else {
      cursor = paginationOptions.cursor;
    }

    try {
      const result = await getUsers.execute(['major', 'major.faculty'], undefined, {
        perPage: normalizedPaginationModel.pageSize,
        cursor,
      });

      match(result, {
        onRight: ([newRows, nextPaginationOptions]) => {
          const hasNextPage = Boolean(nextPaginationOptions.nextCursor);

          let page;
          if (normalizedPaginationModel.page === 0 && nextPaginationOptions.previousCursor) {
            page = 1;
          } else if (
            normalizedPaginationModel.page < paginationModel.page &&
            !nextPaginationOptions.previousCursor
          ) {
            page = 0;
          } else {
            page = normalizedPaginationModel.page;
          }

          setRows(newRows);
          setRowCount(
            hasNextPage ? -1 : page * normalizedPaginationModel.pageSize + newRows.length,
          );
          setPaginationMeta({ hasNextPage });
          setPaginationModel({ page, pageSize: normalizedPaginationModel.pageSize });
          setPaginationOptions(nextPaginationOptions);
        },
        onLeft: (error) => {
          throw error;
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (params: GridRowParams) => {
    router.push(`/users/${params.row.id}`);
  };

  const handleDeleteClick = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setOpenDeleteDialog(true);
  };

  const handleDeleteAccept = async () => {
    if (!selectedUserId) {
      console.error('No user selected for deletion');

      return;
    }

    const result = await deleteUser.execute(selectedUserId);
    match(result, {
      onRight: () => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedUserId));
      },
      onLeft: (error) => {
        console.error('Failed to delete user:', error);
      },
    });

    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedUserId(null);
      setSelectedUserName(null);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedUserId(null);
      setSelectedUserName(null);
    }, 1000);
  };

  return (
    <>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        title="Permanently delete user?"
        description={`Are you sure you want to permanently delete ${selectedUserName || 'this user'}? This action cannot be undone.`}
        acceptText="Delete"
        cancelText="Cancel"
      />
      <Box component="section" className="mb-6 w-full px-6">
        <NoSsr>
          <DataGrid
            sx={{
              '.MuiTablePagination-displayedRows': {
                display: 'none',
              },
              '.MuiDataGrid-row': {
                '&:hover': {
                  cursor: 'pointer',
                },
              },
            }}
            columns={[
              {
                field: 'id',
                headerName: 'ID',
                flex: 1,
                minWidth: 300,
              },
              {
                field: 'name',
                headerName: 'Name',
                flex: 2,
                minWidth: 300,
              },
              {
                field: 'username',
                headerName: 'Username',
                flex: 1,
                minWidth: 100,
              },
              {
                field: 'emailAddress',
                headerName: 'Email Address',
                flex: 2,
                minWidth: 200,
              },
              {
                field: 'phoneNumber',
                headerName: 'Phone Number',
                flex: 1,
                minWidth: 150,
              },
              {
                field: 'studentId',
                headerName: 'Student ID',
                flex: 0.8,
                minWidth: 100,
              },
              {
                field: 'major',
                headerName: 'Major',
                flex: 1,
                minWidth: 150,
              },
              {
                field: 'faculty',
                headerName: 'Faculty',
                flex: 1,
                minWidth: 150,
              },
              {
                field: 'startDate',
                headerName: 'Start Date',
                flex: 0.7,
                minWidth: 100,
                valueFormatter: (value) => {
                  if (!value) return 'N/A';
                  return new Date(value).toLocaleDateString();
                },
              },
              {
                field: 'endDate',
                headerName: 'End Date',
                flex: 0.7,
                minWidth: 100,
                valueFormatter: (value) => {
                  if (!value) return 'N/A';
                  return new Date(value).toLocaleDateString();
                },
              },
              {
                field: 'isMember',
                type: 'boolean',
                headerName: 'Member',
                flex: 0.5,
                minWidth: 80,
              },
              {
                field: 'isExtraordinary',
                type: 'boolean',
                headerName: 'Extraordinary',
                flex: 0.5,
                minWidth: 80,
              },
              {
                field: 'isActive',
                type: 'boolean',
                headerName: 'Active',
                flex: 0.5,
                minWidth: 80,
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
                      // @ts-expect-error Link component requires href prop but it does not exposed as a prop for some reason. Read more on https://github.com/mui/mui-x/issues/9913
                      href={
                        params.row.id === userSession?.user?.id
                          ? '/settings/profile'
                          : `/users/${params.row.id}`
                      }
                    />
                    {['update-user'].some((p) => userPermissions.has(p)) ||
                    (['update-own-user'].some((p) => userPermissions.has(p)) &&
                      params.row.id === userSession?.user?.id) ? (
                      <GridActionsCellItem
                        key="edit"
                        showInMenu
                        icon={<EditRounded />}
                        label="Edit"
                        component={Link}
                        // @ts-expect-error Link component requires href prop but it does not exposed as a prop for some reason. Read more on https://github.com/mui/mui-x/issues/9913
                        href={
                          params.row.id === userSession?.user?.id
                            ? '/settings/profile/edit'
                            : `/users/${params.row.id}/edit`
                        }
                      />
                    ) : null}
                    {['delete-user'].some((p) => userPermissions.has(p)) &&
                    params.row.id !== userSession?.user?.id ? (
                      <GridActionsCellItem
                        key="delete"
                        showInMenu
                        icon={<DeleteRounded />}
                        label="Delete"
                        onClick={() => handleDeleteClick(params.row.id, params.row.name)}
                      />
                    ) : null}
                    {['delete-own-user'].some((p) => userPermissions.has(p)) &&
                    params.row.id === userSession?.user?.id ? (
                      <GridActionsCellItem
                        key="delete-own"
                        showInMenu
                        icon={<DeleteRounded />}
                        label="Delete"
                        component={Link}
                        // @ts-expect-error Link component requires href prop but it does not exposed as a prop for some reason. Read more on https://github.com/mui/mui-x/issues/9913
                        href={`/settings/profile/delete`}
                      />
                    ) : null}
                  </GridActionsCell>
                ),
              },
            ]}
            rows={rows.map((user) => ({
              id: user.id,
              name: user.name,
              username: user.username,
              emailAddress: user.emailAddress,
              phoneNumber: user.phoneNumber,
              studentId: user.studentId,
              major: (user.major as Major)?.name || 'N/A',
              faculty: (user.major as Major)?.faculty?.name || 'N/A',
              startDate: user.startDate,
              endDate: user.endDate,
              isMember: user.isMember,
              isExtraordinary: user.isExtraordinary,
              isActive: user.isActive,
            }))}
            slots={{
              noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
            }}
            slotProps={{
              noRowsOverlay: { text: 'No users found.' },
            }}
            pageSizeOptions={[25, 50, 100]}
            paginationMode="server"
            initialState={{
              columns: {
                columnVisibilityModel: {
                  id: false,
                  username: false,
                  emailAddress: false,
                  phoneNumber: false,
                  isExtraordinary: false,
                },
              },
            }}
            loading={isLoading}
            rowCount={rowCount}
            paginationMeta={paginationMeta}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            onRowClick={handleRowClick}
            disableRowSelectionOnClick
          />
        </NoSsr>
      </Box>
    </>
  );
}
