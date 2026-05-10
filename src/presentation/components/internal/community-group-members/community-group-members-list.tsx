'use client';

import Link from 'next/link';
import { AlertDialog, EmptyRowOverlay } from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CommunityGroupMember, Major, PaginationOptions } from '@app/domain/entities';
import {
  CommunityGroupMemberDto,
  CommunityGroupMemberMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import {
  DataGrid,
  GridActionsCell,
  GridActionsCellItem,
  GridPaginationMeta,
  GridPaginationModel,
  GridRowParams,
  GridSlots,
} from '@mui/x-data-grid';
import { DeleteCommunityGroupMember, GetCommunityGroupMembers } from '@app/application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useInternalStore } from '@app/presentation/hooks';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  initialCommunityGroupMembers: CommunityGroupMemberDto[];
  initialPaginationOptions: PaginationOptionsDto;
  communityGroupId: string;
};

export function CommunityGroupMembersList({
  initialCommunityGroupMembers,
  initialPaginationOptions,
  communityGroupId,
}: Props) {
  const initCommunityGroupMembers = initialCommunityGroupMembers.map(
    CommunityGroupMemberMapper.fromDtoToDomain,
  );
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const getCommunityGroupMembers = useMemo(
    () => clientContainer.get<GetCommunityGroupMembers>(SYMBOLS.GetCommunityGroupMembers),
    [],
  );
  const deleteCommunityGroupMember = useMemo(
    () => clientContainer.get<DeleteCommunityGroupMember>(SYMBOLS.DeleteCommunityGroupMember),
    [],
  );
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = new Set(userSession?.permissions || []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<CommunityGroupMember[]>(initCommunityGroupMembers);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initCommunityGroupMembers.length,
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
  const [selectedCommunityGroupMemberId, setSelectedCommunityGroupMemberId] = useState<
    string | null
  >(null);
  const [selectedCommunityGroupMemberName, setSelectedCommunityGroupMemberName] = useState<
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
      const result = await getCommunityGroupMembers.execute(
        communityGroupId,
        ['major', 'major.faculty'],
        undefined,
        {
          perPage: normalizedPaginationModel.pageSize,
          cursor,
        },
      );

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

  const handleDeleteClick = (communityGroupMemberId: string, communityGroupMemberName?: string) => {
    setSelectedCommunityGroupMemberId(communityGroupMemberId);
    setSelectedCommunityGroupMemberName(communityGroupMemberName || null);
    setOpenDeleteDialog(true);
  };

  const handleDeleteAccept = async () => {
    if (!selectedCommunityGroupMemberId) {
      console.error('No community group member selected for deletion');

      return;
    }

    const result = await deleteCommunityGroupMember.execute(selectedCommunityGroupMemberId);
    match(result, {
      onRight: () => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedCommunityGroupMemberId));
      },
      onLeft: (error) => {
        console.error('Failed to delete community group member:', error);
      },
    });

    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedCommunityGroupMemberId(null);
      setSelectedCommunityGroupMemberName(null);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedCommunityGroupMemberId(null);
      setSelectedCommunityGroupMemberName(null);
    }, 1000);
  };

  return (
    <>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedCommunityGroupMemberName || 'this member'}? This action cannot be undone.`}
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
                field: 'username',
                headerName: 'Username',
                flex: 1,
              },
              {
                field: 'emailAddress',
                headerName: 'Email Address',
                flex: 2,
              },
              {
                field: 'phoneNumber',
                headerName: 'Phone Number',
                flex: 1,
              },
              {
                field: 'studentId',
                headerName: 'Student ID',
                flex: 1,
              },
              {
                field: 'major',
                headerName: 'Major',
                flex: 1,
              },
              {
                field: 'faculty',
                headerName: 'Faculty',
                flex: 1,
              },
              {
                field: 'startDate',
                headerName: 'Start Date',
                flex: 1,
                valueFormatter: (value) => {
                  if (!value) return 'N/A';
                  return new Date(value).toLocaleDateString();
                },
              },
              {
                field: 'endDate',
                headerName: 'End Date',
                flex: 1,
                valueFormatter: (value) => {
                  if (!value) return 'N/A';
                  return new Date(value).toLocaleDateString();
                },
              },
              {
                field: 'isMember',
                headerName: 'Member',
                flex: 0.5,
                type: 'boolean',
              },
              {
                field: 'isExtraordinary',
                headerName: 'Extraordinary',
                flex: 0.5,
                type: 'boolean',
              },
              {
                field: 'isActive',
                headerName: 'Active',
                flex: 0.5,
                type: 'boolean',
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
                      href={`/users/${params.row.actions.id}`}
                    />
                    {['update-community-group-member'].some((p) => userPermissions.has(p)) ||
                    (['update-own-community-group-member'].some((p) => userPermissions.has(p)) &&
                      params.row.actions.id === userSession?.user?.id) ? (
                      <GridActionsCellItem
                        key="edit"
                        showInMenu
                        icon={<EditRounded />}
                        label="Edit"
                        component={Link}
                        // @ts-expect-error Link component requires href prop but it does not exposed as a prop for some reason. Read more on https://github.com/mui/mui-x/issues/9913
                        href={`/community-groups/${communityGroupId}/members/${params.row.actions.id}/edit`}
                      />
                    ) : null}
                    {['delete-community-group-member'].some((p) => userPermissions.has(p)) ||
                    (['delete-own-community-group-member'].some((p) => userPermissions.has(p)) &&
                      params.row.actions.id === userSession?.user?.id) ? (
                      <GridActionsCellItem
                        key="delete"
                        showInMenu
                        icon={<DeleteRounded />}
                        label="Delete"
                        onClick={() =>
                          handleDeleteClick(params.row.actions.id, params.row.actions.name)
                        }
                      />
                    ) : null}
                  </GridActionsCell>
                ),
              },
            ]}
            rows={rows.map((member) => ({
              id: member.id,
              name: member.name,
              username: member.username,
              emailAddress: member.emailAddress,
              phoneNumber: member.phoneNumber,
              studentId: member.studentId,
              major: (member.major as Major)?.name || 'N/A',
              faculty: (member.major as Major)?.faculty?.name || 'N/A',
              startDate: member.startDate,
              endDate: member.endDate,
              isMember: member.isMember,
              isExtraordinary: member.isExtraordinary,
              isActive: member.isActive,
              actions: member,
            }))}
            slots={{
              noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
            }}
            slotProps={{
              noRowsOverlay: { text: 'No community group members found.' },
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
                  startDate: false,
                  endDate: false,
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
