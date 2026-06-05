'use client';

import Link from 'next/link';
import { AlertDialog, EmptyRowOverlay } from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CoreTeamMember, Major, PaginationOptions } from '@app/domain/entities';
import {
  CoreTeamMemberDto,
  CoreTeamMemberMapper,
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
import { DeleteCoreTeamMember, GetCoreTeamMembers } from '@app/application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useInternalStore } from '@app/presentation/hooks';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  initialCoreTeamMembers: CoreTeamMemberDto[];
  initialPaginationOptions: PaginationOptionsDto;
  coreTeamId: string;
};

export function CoreTeamMembersList({
  initialCoreTeamMembers,
  initialPaginationOptions,
  coreTeamId,
}: Props) {
  const initCoreTeamMembers = initialCoreTeamMembers.map(CoreTeamMemberMapper.fromDtoToDomain);
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const getCoreTeamMembers = useMemo(
    () => clientContainer.get<GetCoreTeamMembers>(SYMBOLS.GetCoreTeamMembers),
    [],
  );
  const deleteCoreTeamMember = useMemo(
    () => clientContainer.get<DeleteCoreTeamMember>(SYMBOLS.DeleteCoreTeamMember),
    [],
  );
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = new Set(userSession?.permissions || []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<CoreTeamMember[]>(initCoreTeamMembers);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initCoreTeamMembers.length,
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
  const [selectedCoreTeamMemberId, setSelectedCoreTeamMemberId] = useState<string | null>(null);
  const [selectedCoreTeamMemberName, setSelectedCoreTeamMemberName] = useState<string | null>(null);

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
      const result = await getCoreTeamMembers.execute(
        coreTeamId,
        ['major', 'major.faculty', 'membership.core_team_division'],
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
    router.push(`/core-teams/${coreTeamId}/members/${params.row.membershipId}`);
  };

  const handleDeleteClick = (coreTeamMemberId: string, coreTeamMemberName?: string) => {
    setSelectedCoreTeamMemberId(coreTeamMemberId);
    setSelectedCoreTeamMemberName(coreTeamMemberName || null);
    setOpenDeleteDialog(true);
  };

  const handleDeleteAccept = async () => {
    if (!selectedCoreTeamMemberId) {
      console.error('No core team member selected for deletion');

      return;
    }

    const result = await deleteCoreTeamMember.execute(selectedCoreTeamMemberId);
    match(result, {
      onRight: () => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedCoreTeamMemberId));
      },
      onLeft: (error) => {
        console.error('Failed to delete core team member:', error);
      },
    });

    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedCoreTeamMemberId(null);
      setSelectedCoreTeamMemberName(null);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedCoreTeamMemberId(null);
      setSelectedCoreTeamMemberName(null);
    }, 1000);
  };

  return (
    <>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedCoreTeamMemberName || 'this member'}? This action cannot be undone.`}
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
                field: 'division',
                headerName: 'Division',
                flex: 1,
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
                      href={`/core-teams/${coreTeamId}/members/${params.row.membershipId}`}
                    />
                    {['update-core-team-member'].some((p) => userPermissions.has(p)) ? (
                      <GridActionsCellItem
                        key="edit"
                        showInMenu
                        icon={<EditRounded />}
                        label="Edit"
                        component={Link}
                        // @ts-expect-error Link component requires href prop but it does not exposed as a prop for some reason. Read more on https://github.com/mui/mui-x/issues/9913
                        href={`/core-teams/${coreTeamId}/members/${params.row.membershipId}/edit`}
                      />
                    ) : null}
                    {['delete-core-team-member'].some((p) => userPermissions.has(p)) ? (
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
            rows={rows.map((member) => ({
              id: member.id,
              name: member.name,
              division: member.membership.coreTeamDivision?.name || 'N/A',
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
              membershipId: member.membership.id,
              actions: member,
            }))}
            slots={{
              noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
            }}
            slotProps={{
              noRowsOverlay: { text: 'No core team members found.' },
              loadingOverlay: {
                variant: 'skeleton',
                noRowsVariant: 'skeleton',
              },
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
