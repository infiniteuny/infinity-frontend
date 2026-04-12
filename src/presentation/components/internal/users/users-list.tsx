'use client';

import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  DataGrid,
  GridSlots,
  GridPaginationModel,
  GridPaginationMeta,
  GridRowParams,
} from '@mui/x-data-grid';
import { EmptyRowOverlay } from '@app/presentation/components/internal/shared';
import { GetUsers } from '@app/application';
import { match } from 'effect/Either';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserDto,
  UserMapper,
} from '@app/infrastructure/dtos';
import { SYMBOLS } from '@config';
import { User, PaginationOptions, Major } from '@app/domain/entities';
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
  const router = useRouter();

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
    const userId = params.row.id;

    router.push(`/users/${userId}`);
  };

  return (
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
  );
}
