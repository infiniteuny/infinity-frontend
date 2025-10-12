'use client';

import { Box, Container, NoSsr } from '@mui/material';
import { DataGrid, GridSlots, GridPaginationModel, GridPaginationMeta } from '@mui/x-data-grid';
import { EmptyRowOverlay } from '@app/presentation/components/internal/shared';
import { User, PaginationOptions } from '@app/domain/entities';
import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { clientContainer } from '@app/client-injection';
import { GetUsers } from '@app/application';
import { SYMBOLS } from '@config';

export function UsersList() {
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows, setRows] = useState<any>([]);

  // Map to store cursors for each page
  const mapPageToNextCursor = useRef<{ [page: number]: string }>({});

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });

  // Ref to store pagination meta to avoid flickering
  const paginationMetaRef = useRef<GridPaginationMeta | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState<boolean | undefined>(undefined);

  // Memoize pagination meta to avoid flickering
  const paginationMeta = useMemo(() => {
    if (hasNextPage !== undefined && paginationMetaRef.current?.hasNextPage !== hasNextPage) {
      paginationMetaRef.current = { hasNextPage };
    }
    return paginationMetaRef.current;
  }, [hasNextPage]);

  // Row count state for unknown pagination
  const [rowCountState, setRowCountState] = useState(0);

  useEffect(() => {
    if (paginationMeta?.hasNextPage !== false) {
      setRowCountState(-1); // -1 indicates unknown count
    }
  }, [paginationMeta?.hasNextPage]);

  // Function to fetch users data
  const fetchUsers = useCallback(async (page: number, pageSize: number) => {
    setIsLoading(true);

    try {
      // Get cursor for the current page (if not first page)
      const cursor = page > 0 ? mapPageToNextCursor.current[page - 1] : undefined;

      // Create pagination options with cursor
      const paginationOptions = new PaginationOptions(
        pageSize,
        cursor, // nextCursor
        undefined, // previousCursor
      );

      const getUsers = clientContainer.get<GetUsers>(SYMBOLS.GetUsers);
      // Fetch users with cursor-based pagination
      const result = await getUsers.execute(
        undefined, // filterOptions
        paginationOptions, // paginationOptions
      );

      // Check if the result is successful (Either Right)
      if ('right' in result) {
        const [users, paginationOptions] = result.right;

        // Transform users to include id field required by DataGrid
        const transformedUsers = users.map((user: User, index: number) => ({
          ...user,
          id: user.studentId || `user-${page * pageSize + index}`, // Use studentId as id or fallback
        }));

        setRows(transformedUsers);

        // Determine hasNextPage based on the existence of nextCursor
        const hasNext = Boolean(paginationOptions?.nextCursor);
        setHasNextPage(hasNext);

        // Store cursor for next page if we have more data
        if (hasNext && paginationOptions.nextCursor) {
          mapPageToNextCursor.current[page] = paginationOptions.nextCursor;
        }
      } else {
        console.error('Failed to fetch users:', result.left);
        setRows([]);
        setHasNextPage(false);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setRows([]);
      setHasNextPage(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    fetchUsers(paginationModel.page, paginationModel.pageSize);
  }, [fetchUsers, paginationModel.page, paginationModel.pageSize]);

  const handlePaginationModelChange = useCallback(
    (newPaginationModel: GridPaginationModel) => {
      // For cursor-based pagination, we can only go to the next page if we have the cursor
      // or go back to a previous page, or go to the first page
      if (
        newPaginationModel.page === 0 || // First page
        newPaginationModel.page < paginationModel.page || // Going back
        mapPageToNextCursor.current[newPaginationModel.page - 1] // We have the cursor for this page
      ) {
        setPaginationModel(newPaginationModel);
      }
    },
    [paginationModel.page],
  );

  return (
    <Box component="section" className="w-full px-6">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full p-4 rounded-2xl"
      >
        <NoSsr>
          <DataGrid
            columns={[
              {
                field: 'name',
                headerName: 'Name',
                flex: 2,
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
            loading={isLoading}
            rowCount={rowCountState}
            paginationMeta={paginationMeta}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            disableRowSelectionOnClick
          />
        </NoSsr>
      </Container>
    </Box>
  );
}
