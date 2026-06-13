'use client';

import Link from 'next/link';
import {
  AlertDialog,
  BooleanOperators,
  DateOperators,
  EmptyRowOverlay,
  StringOperators,
} from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  CommunityGroupAdminMember,
  FilterOperator,
  Major,
  PaginationOptions,
  UserFilterOptions,
  UserSortOptions,
} from '@app/domain/entities';
import {
  CommunityGroupAdminMemberDto,
  CommunityGroupAdminMemberMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import {
  DataGrid,
  GridActionsCell,
  GridActionsCellItem,
  GridFilterModel,
  GridPaginationMeta,
  GridPaginationModel,
  GridRowParams,
  GridSlots,
  GridSortModel,
} from '@mui/x-data-grid';
import { DeleteCommunityGroupAdminMember, GetCommunityGroupAdminMembers } from '@app/application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useInternalStore } from '@app/presentation/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DateTime } from 'luxon';
import { convertDateFilterOperator } from '@app/utils';

type Props = {
  initialCommunityGroupAdminMembers: CommunityGroupAdminMemberDto[];
  initialPaginationOptions: PaginationOptionsDto;
  communityGroupAdminId: string;
};

export function CommunityGroupAdminMembersList({
  initialCommunityGroupAdminMembers,
  initialPaginationOptions,
  communityGroupAdminId,
}: Props) {
  const getCommunityGroupAdminMembers = useMemo(
    () => clientContainer.get<GetCommunityGroupAdminMembers>(SYMBOLS.GetCommunityGroupAdminMembers),
    [],
  );
  const deleteCommunityGroupAdminMember = useMemo(
    () =>
      clientContainer.get<DeleteCommunityGroupAdminMember>(SYMBOLS.DeleteCommunityGroupAdminMember),
    [],
  );
  const initCommunityGroupAdminMembers = initialCommunityGroupAdminMembers.map(
    CommunityGroupAdminMemberMapper.fromDtoToDomain,
  );
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = new Set(userSession?.permissions || []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<CommunityGroupAdminMember[]>(initCommunityGroupAdminMembers);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initCommunityGroupAdminMembers.length,
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

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedCommunityGroupAdminMemberId, setSelectedCommunityGroupAdminMemberId] = useState<
    string | null
  >(null);
  const [selectedCommunityGroupAdminMemberName, setSelectedCommunityGroupAdminMemberName] =
    useState<string | null>(null);

  const convertSortModelToDomain = (model: GridSortModel): UserSortOptions | undefined => {
    if (model.length === 0) return undefined;

    const fieldMap: Record<string, keyof UserSortOptions> = {
      name: 'name',
      username: 'username',
      emailAddress: 'emailAddress',
      phoneNumber: 'phoneNumber',
      studentId: 'studentId',
      startDate: 'startDate',
      endDate: 'endDate',
      isMember: 'isMember',
      isExtraordinary: 'isExtraordinary',
    };

    const sortOptions: UserSortOptions = {};
    for (const sortItem of model) {
      const domainField = fieldMap[sortItem.field];
      if (domainField) {
        sortOptions[domainField] = sortItem.sort === 'asc' ? 'ASC' : 'DESC';
      }
    }

    return Object.keys(sortOptions).length > 0 ? sortOptions : undefined;
  };

  const convertFilterModelToDomain = (model: GridFilterModel): UserFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;

    const filterOptions: UserFilterOptions = {};

    for (const filterItem of model.items) {
      switch (filterItem.field) {
        case 'name':
          if (filterItem.value != null) {
            filterOptions.name = String(filterItem.value);
          }
          break;
        case 'username':
          if (filterItem.value != null) {
            filterOptions.username = String(filterItem.value);
          }
          break;
        case 'emailAddress':
          if (filterItem.value != null) {
            filterOptions.emailAddress = String(filterItem.value);
          }
          break;
        case 'phoneNumber':
          if (filterItem.value != null) {
            filterOptions.phoneNumber = String(filterItem.value);
          }
          break;
        case 'studentId':
          if (filterItem.value != null) {
            filterOptions.studentId = String(filterItem.value);
          }
          break;
        case 'isMember':
          if (filterItem.value != null) {
            filterOptions.isMember = Boolean(filterItem.value);
          }
          break;
        case 'isExtraordinary':
          if (filterItem.value != null) {
            filterOptions.isExtraordinary = Boolean(filterItem.value);
          }
          break;
        case 'startDate':
          if (filterItem.operator === 'isEmpty') {
            filterOptions.startDateOperator = FilterOperator.EQUAL;
            filterOptions.startDate = null;
          } else if (filterItem.operator === 'isNotEmpty') {
            filterOptions.startDateOperator = FilterOperator.NOT_EQUAL;
            filterOptions.startDate = null;
          } else if (filterItem.value != null) {
            filterOptions.startDate =
              filterItem.value instanceof Date ? filterItem.value : new Date(filterItem.value);
            filterOptions.startDateOperator = convertDateFilterOperator(filterItem.operator);
          }
          break;
        case 'endDate':
          if (filterItem.operator === 'isEmpty') {
            filterOptions.endDateOperator = FilterOperator.EQUAL;
            filterOptions.endDate = null;
          } else if (filterItem.operator === 'isNotEmpty') {
            filterOptions.endDateOperator = FilterOperator.NOT_EQUAL;
            filterOptions.endDate = null;
          } else if (filterItem.value != null) {
            filterOptions.endDate =
              filterItem.value instanceof Date ? filterItem.value : new Date(filterItem.value);
            filterOptions.endDateOperator = convertDateFilterOperator(filterItem.operator);
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

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      const sortOptions = convertSortModelToDomain(sortModel);
      const filterOptions = convertFilterModelToDomain(filterModel);

      try {
        const result = await getCommunityGroupAdminMembers.execute(
          communityGroupAdminId,
          ['major', 'major.faculty', 'membership.community_group'],
          filterOptions,
          sortOptions,
          { perPage: paginationModel.pageSize, cursor },
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
  }, [
    paginationModel,
    sortModel,
    filterModel,
    cursor,
    getCommunityGroupAdminMembers,
    communityGroupAdminId,
  ]);

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

  const handleRowClick = (params: GridRowParams) => {
    router.push(
      `/community-group-admins/${communityGroupAdminId}/members/${params.row.membershipId}`,
    );
  };

  const handleDeleteClick = (
    communityGroupAdminMemberId: string,
    communityGroupAdminMemberName?: string,
  ) => {
    setSelectedCommunityGroupAdminMemberId(communityGroupAdminMemberId);
    setSelectedCommunityGroupAdminMemberName(communityGroupAdminMemberName || null);
    setOpenDeleteDialog(true);
  };

  const handleDeleteAccept = async () => {
    if (!selectedCommunityGroupAdminMemberId) {
      console.error('No community group admin member selected for deletion');

      return;
    }

    const result = await deleteCommunityGroupAdminMember.execute(
      selectedCommunityGroupAdminMemberId,
    );
    match(result, {
      onRight: () => {
        setRows((prevRows) =>
          prevRows.filter((row) => row.id !== selectedCommunityGroupAdminMemberId),
        );
      },
      onLeft: (error) => {
        console.error('Failed to delete community group admin member:', error);
      },
    });

    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedCommunityGroupAdminMemberId(null);
      setSelectedCommunityGroupAdminMemberName(null);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedCommunityGroupAdminMemberId(null);
      setSelectedCommunityGroupAdminMemberName(null);
    }, 1000);
  };

  return (
    <>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedCommunityGroupAdminMemberName || 'this member'}? This action cannot be undone.`}
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
                field: 'group',
                headerName: 'Group',
                flex: 1,
                minWidth: 170,
                filterable: false,
                sortable: false,
              },
              {
                field: 'username',
                headerName: 'Username',
                flex: 1,
                minWidth: 120,
                filterable: true,
                sortable: true,
                filterOperators: [StringOperators.contains],
              },
              {
                field: 'emailAddress',
                headerName: 'Email Address',
                flex: 2,
                minWidth: 200,
                filterable: true,
                sortable: true,
                filterOperators: [StringOperators.contains],
              },
              {
                field: 'phoneNumber',
                headerName: 'Phone Number',
                flex: 1,
                minWidth: 120,
                filterable: true,
                sortable: true,
                filterOperators: [StringOperators.contains],
              },
              {
                field: 'studentId',
                headerName: 'Student ID',
                flex: 0.8,
                minWidth: 120,
                filterable: true,
                sortable: true,
                filterOperators: [StringOperators.contains],
              },
              {
                field: 'major',
                headerName: 'Major',
                flex: 1.2,
                minWidth: 170,
                filterable: false,
                sortable: false,
              },
              {
                field: 'faculty',
                headerName: 'Faculty',
                flex: 1.2,
                minWidth: 170,
                filterable: false,
                sortable: false,
              },
              {
                field: 'startDate',
                type: 'date',
                headerName: 'Start Date',
                flex: 0.7,
                minWidth: 100,
                filterable: true,
                sortable: true,
                filterOperators: [
                  DateOperators.is,
                  DateOperators.not,
                  DateOperators.after,
                  DateOperators.onOrAfter,
                  DateOperators.before,
                  DateOperators.onOrBefore,
                  DateOperators.isEmpty,
                  DateOperators.isNotEmpty,
                ],
                valueFormatter: (value) => {
                  if (!value) return 'N/A';
                  return DateTime.fromJSDate(value).toFormat('dd/LL/yyyy');
                },
              },
              {
                field: 'endDate',
                type: 'date',
                headerName: 'End Date',
                flex: 0.7,
                minWidth: 100,
                filterable: true,
                sortable: true,
                filterOperators: [
                  DateOperators.is,
                  DateOperators.not,
                  DateOperators.after,
                  DateOperators.onOrAfter,
                  DateOperators.before,
                  DateOperators.onOrBefore,
                  DateOperators.isEmpty,
                  DateOperators.isNotEmpty,
                ],
                valueFormatter: (value) => {
                  if (!value) return 'N/A';
                  return DateTime.fromJSDate(value).toFormat('dd/LL/yyyy');
                },
              },
              {
                field: 'isMember',
                type: 'boolean',
                headerName: 'Member',
                flex: 0.5,
                minWidth: 80,
                filterable: true,
                sortable: true,
                filterOperators: [BooleanOperators.is],
              },
              {
                field: 'isExtraordinary',
                type: 'boolean',
                headerName: 'Extraordinary',
                flex: 0.5,
                minWidth: 80,
                filterable: true,
                sortable: true,
                filterOperators: [BooleanOperators.is],
              },
              {
                field: 'isActive',
                type: 'boolean',
                headerName: 'Active',
                flex: 0.5,
                minWidth: 80,
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
                      // @ts-expect-error Link component requires href prop but it does not exposed as a prop for some reason. Read more on https://github.com/mui/mui-x/issues/9913
                      href={`/community-group-admins/${communityGroupAdminId}/members/${params.row.membershipId}`}
                    />
                    {['update-community-group-admin-member'].some((p) => userPermissions.has(p)) ? (
                      <GridActionsCellItem
                        key="edit"
                        showInMenu
                        icon={<EditRounded />}
                        label="Edit"
                        component={Link}
                        // @ts-expect-error Link component requires href prop but it does not exposed as a prop for some reason. Read more on https://github.com/mui/mui-x/issues/9913
                        href={`/community-group-admins/${communityGroupAdminId}/members/${params.row.membershipId}/edit`}
                      />
                    ) : null}
                    {['delete-community-group-admin-member'].some((p) => userPermissions.has(p)) ? (
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
              group: member.membership.communityGroup?.name || 'N/A',
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
              noRowsOverlay: { text: 'No community group administrator members found.' },
              loadingOverlay: {
                variant: 'skeleton',
                noRowsVariant: 'skeleton',
              },
            }}
            pageSizeOptions={[25, 50, 100]}
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
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
