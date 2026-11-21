'use client';

import Link from 'next/link';
import {
  AlertDialog,
  BooleanOperators,
  DateOperators,
  EmptyRowOverlay,
  MajorFilterInput,
  SectionHeader,
  StringOperators,
} from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  CommunityGroupMember,
  FilterOperator,
  Major,
  UserFilterOptions,
  UserSortOptions,
} from '@infiniteuny/infinity-domain';
import {
  CommunityGroupDto,
  CommunityGroupMapper,
  CommunityGroupMemberDto,
  CommunityGroupMemberMapper,
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
  DeleteCommunityGroupMember,
  GetCommunityGroupMembers,
} from '@infiniteuny/infinity-application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { SYMBOLS } from '@config';
import { useCursorDataGrid, useInternalStore, useUserPermissions } from '@app/presentation/hooks';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DateTime } from 'luxon';
import { convertDateFilterOperator } from '@infiniteuny/infinity-utils';
import { CommunityGroupMembersToolbar } from './community-group-members-toolbar';

const DATA_GRID_SX: DataGridProps['sx'] = {
  '.MuiTablePagination-displayedRows': { display: 'none' },
  '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
};

const DATA_GRID_SLOTS: Partial<GridSlots> = {
  noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
};

const DATA_GRID_SLOT_PROPS: DataGridProps['slotProps'] = {
  noRowsOverlay: { text: 'No community group members found.' },
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
      username: false,
      emailAddress: false,
      phoneNumber: false,
      startDate: false,
      endDate: false,
      isExtraordinary: false,
    },
  },
};

type Props = {
  initialCommunityGroupMembers: CommunityGroupMemberDto[];
  initialPaginationOptions: PaginationOptionsDto;
  communityGroup: CommunityGroupDto;
};

export function CommunityGroupMembersList({
  initialCommunityGroupMembers,
  initialPaginationOptions,
  communityGroup,
}: Props) {
  const getCommunityGroupMembers = useMemo(
    () => clientContainer.get<GetCommunityGroupMembers>(SYMBOLS.GetCommunityGroupMembers),
    [],
  );
  const deleteCommunityGroupMember = useMemo(
    () => clientContainer.get<DeleteCommunityGroupMember>(SYMBOLS.DeleteCommunityGroupMember),
    [],
  );
  const parsedCommunityGroup = useMemo(
    () => CommunityGroupMapper.fromDtoToDomain(communityGroup),
    [communityGroup],
  );
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = useUserPermissions();

  const convertSortModelToDomain = (model: GridSortModel): UserSortOptions | undefined => {
    if (model.length === 0) return undefined;

    const fieldMap: Record<string, keyof UserSortOptions> = {
      id: 'id',
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
        case 'major':
          if (filterItem.value != null) {
            filterOptions.majorId = String(filterItem.value);
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
    selectedName: selectedCommunityGroupMemberName,
    handleDeleteClick,
    handleDeleteAccept,
    handleDeleteCancel,
    handleDeleteDialogExited,
  } = useCursorDataGrid<CommunityGroupMember>({
    initialRows: () => initialCommunityGroupMembers.map(CommunityGroupMemberMapper.fromDtoToDomain),
    initialRowCount: initialCommunityGroupMembers.length,
    initialPaginationOptions,
    fetchPage: ({ filterModel, sortModel, pageSize, cursor }) => {
      const sortOptions = convertSortModelToDomain(sortModel);
      const filterOptions = convertFilterModelToDomain(filterModel);
      return getCommunityGroupMembers.execute(
        parsedCommunityGroup.id,
        ['major', 'major.faculty'],
        filterOptions,
        sortOptions,
        { perPage: pageSize, cursor },
      );
    },
    deleteRow: (id) => deleteCommunityGroupMember.execute(id),
    entityLabel: 'community group members',
  });

  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      router.push(`/users/${params.row.id}`);
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
        filterable: true,
        sortable: false,
        filterOperators: [
          {
            label: 'is',
            value: 'is',
            getApplyFilterFn: (filterItem) => {
              if (!filterItem.field || !filterItem.value || !filterItem.operator) {
                return null;
              }

              return (value) => {
                return value === filterItem.value;
              };
            },
            InputComponent: MajorFilterInput,
          },
        ],
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
                href={`/community-groups/${parsedCommunityGroup.id}/members/${params.row.actions.id}/edit`}
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
                  handleDeleteClick(params.row.actions.membership.id, params.row.actions.name)
                }
              />
            ) : null}
          </GridActionsCell>
        ),
      },
    ],
    [userPermissions, userSession?.user?.id, parsedCommunityGroup.id, handleDeleteClick],
  );

  const gridRows = useMemo(
    () =>
      rows.map((member) => ({
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
      })),
    [rows],
  );

  return (
    <>
      <SectionHeader
        title={`${parsedCommunityGroup.name}'s Members`}
        backUrl={`/community-groups/${parsedCommunityGroup.id}`}
      >
        <CommunityGroupMembersToolbar
          communityGroupId={parsedCommunityGroup.id}
          dataGridApiRef={dataGridApiRef}
        />
      </SectionHeader>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        onExited={handleDeleteDialogExited}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedCommunityGroupMemberName || 'this member'}? This action cannot be undone.`}
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
