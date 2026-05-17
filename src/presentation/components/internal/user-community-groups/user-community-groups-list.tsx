'use client';

import Link from 'next/link';
import { AlertDialog, EmptyRowOverlay } from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  DataGrid,
  GridActionsCell,
  GridActionsCellItem,
  GridPaginationMeta,
  GridPaginationModel,
  GridRowParams,
  GridSlots,
} from '@mui/x-data-grid';
import { DeleteCommunityGroupMember, GetUserCommunityGroups } from '@app/application';
import { DeleteRounded, VisibilityRounded } from '@mui/icons-material';
import { match } from 'effect/Either';
import { PaginationOptions, UserCommunityGroup } from '@app/domain/entities';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserCommunityGroupDto,
  UserCommunityGroupMapper,
} from '@app/infrastructure/dtos';
import { SYMBOLS } from '@config';
import { useInternalStore } from '@app/presentation/hooks';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  initialUserCommunityGroups: UserCommunityGroupDto[];
  initialPaginationOptions: PaginationOptionsDto;
  userId: string;
};

export function UserCommunityGroupsList({
  initialUserCommunityGroups,
  initialPaginationOptions,
  userId,
}: Props) {
  const getUserCommunityGroups = useMemo(
    () => clientContainer.get<GetUserCommunityGroups>(SYMBOLS.GetUserCommunityGroups),
    [],
  );
  const deleteCommunityGroupMember = useMemo(
    () => clientContainer.get<DeleteCommunityGroupMember>(SYMBOLS.DeleteCommunityGroupMember),
    [],
  );
  const initUserCommunityGroups = initialUserCommunityGroups.map(
    UserCommunityGroupMapper.fromDtoToDomain,
  );
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = new Set(userSession?.permissions || []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<UserCommunityGroup[]>(initUserCommunityGroups);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initUserCommunityGroups.length,
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
  const [selectedUserCommunityGroupId, setSelectedUserCommunityGroupId] = useState<string | null>(
    null,
  );
  const [selectedUserCommunityGroupName, setSelectedUserCommunityGroupName] = useState<
    string | null
  >(null);

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
      const result = await getUserCommunityGroups.execute(userId, undefined, {
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

  const handleDeleteClick = (userCommunityGroupId: string, userCommunityGroupName?: string) => {
    setSelectedUserCommunityGroupId(userCommunityGroupId);
    setSelectedUserCommunityGroupName(userCommunityGroupName || null);
    setOpenDeleteDialog(true);
  };

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

  const handleRowClick = (params: GridRowParams) => {
    router.push(`/community-groups/${params.row.id}`);
  };

  return (
    <>
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
            sx={{
              '.MuiTablePagination-displayedRows': { display: 'none' },
              '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
            }}
            columns={[
              {
                field: 'id',
                headerName: 'ID',
                flex: 1,
              },
              {
                field: 'name',
                headerName: 'Name',
                flex: 2,
              },
              {
                field: 'priority',
                headerName: 'Priority',
                flex: 1,
              },
              {
                field: 'isActive',
                headerName: 'Active',
                type: 'boolean',
                flex: 1,
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
                      href={`/community-groups/${params.row.actions.id}`}
                    />
                    {['delete-community-group-member'].some((p) => userPermissions.has(p)) ||
                    (['delete-own-community-group-member'].some((p) => userPermissions.has(p)) &&
                      userId === userSession?.user?.id) ? (
                      <GridActionsCellItem
                        key="delete"
                        showInMenu
                        icon={<DeleteRounded />}
                        label="Delete"
                        onClick={() =>
                          handleDeleteClick(
                            params.row.actions.membership.id,
                            params.row.actions.name,
                          )
                        }
                      />
                    ) : null}
                  </GridActionsCell>
                ),
              },
            ]}
            rows={rows.map((userCommunityGroup) => ({
              id: userCommunityGroup.id,
              name: userCommunityGroup.name,
              priority: userCommunityGroup.priority,
              isActive: userCommunityGroup.isActive,
              actions: userCommunityGroup,
            }))}
            slots={{
              noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
            }}
            slotProps={{
              noRowsOverlay: { text: 'No user community groups found.' },
            }}
            pageSizeOptions={[25, 50, 100]}
            paginationMode="server"
            initialState={{
              columns: {
                columnVisibilityModel: {
                  id: false,
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
