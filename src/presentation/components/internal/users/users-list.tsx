'use client';

import { Box, Container, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { DataGrid, GridSlots, GridPaginationModel, GridPaginationMeta } from '@mui/x-data-grid';
import { EmptyRowOverlay } from '@app/presentation/components/internal/shared';
import { GetUsers } from '@app/application';
import { SYMBOLS } from '@config';
import { User, PaginationOptions } from '@app/domain/entities';
import { useState } from 'react';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserDto,
  UserMapper,
} from '@app/infrastructure/dtos';
import { match } from 'effect/Either';

type Props = {
  initialUsers: UserDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function UsersList({ initialUsers, initialPaginationOptions }: Props) {
  const initUsers = initialUsers.map(UserMapper.fromDtoToDomain);
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const getUsers = clientContainer.get<GetUsers>(SYMBOLS.GetUsers);

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
    setIsLoading(true);

    let cursor: string | undefined;
    if (newPaginationModel.page > paginationModel.page && paginationOptions.nextCursor) {
      cursor = paginationOptions.nextCursor;
    } else if (newPaginationModel.page < paginationModel.page && paginationOptions.previousCursor) {
      cursor = paginationOptions.previousCursor;
    } else {
      cursor = paginationOptions.cursor;
    }

    const newPaginationOptions = new PaginationOptions(newPaginationModel.pageSize, cursor);

    try {
      await fetchUsers(newPaginationOptions, newPaginationModel);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async (
    paginationOptions: PaginationOptions,
    newPaginationModel?: GridPaginationModel,
  ): Promise<void> => {
    const result = await getUsers.execute(undefined, paginationOptions);

    return match(result, {
      onRight: ([users, newPaginationOptions]) => {
        setRows(users);
        setPaginationOptions(newPaginationOptions);
        setPaginationMeta({
          hasNextPage: Boolean(newPaginationOptions.nextCursor),
        });

        let page;
        if (newPaginationModel?.page === 0 && newPaginationOptions.previousCursor) {
          page = 1;
        } else if (newPaginationModel) {
          page = newPaginationModel.page;
        } else if (paginationModel.page === 0 && newPaginationOptions.previousCursor) {
          page = 1;
        } else {
          page = paginationModel.page;
        }

        setPaginationModel({
          page,
          pageSize: newPaginationModel?.pageSize || paginationModel.pageSize,
        });
      },
      onLeft: (error) => {
        throw error;
      },
    });
  };

  return (
    <Box component="section" className="w-full px-6">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full p-4 rounded-2xl"
      >
        <NoSsr>
          <DataGrid
            sx={{
              '.MuiTablePagination-displayedRows': {
                display: 'none',
              },
            }}
            columns={[
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
                  if (!value) return '';
                  return new Date(value).toLocaleDateString();
                },
              },
              {
                field: 'endDate',
                headerName: 'End Date',
                flex: 1,
                valueFormatter: (value) => {
                  if (!value) return '';
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
            rows={rows}
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
            onRowCountChange={setRowCount}
            onPaginationModelChange={handlePaginationModelChange}
            disableRowSelectionOnClick
          />
        </NoSsr>
      </Container>
    </Box>
  );
}
