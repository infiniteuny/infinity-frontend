'use client';

import { Box, Container, NoSsr } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationMeta,
  GridPaginationModel,
  GridRowParams,
  GridSlots,
} from '@mui/x-data-grid';
import { GetPermissions } from '@app/application';
import { clientContainer } from '@app/client-injection';
import { Permission, PaginationOptions } from '@app/domain/entities';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  PermissionDto,
  PermissionMapper,
} from '@app/infrastructure/dtos';
import { EmptyRowOverlay } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type Props = {
  initialPermissions: PermissionDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 1 },
  { field: 'name', headerName: 'Name', flex: 1.5 },
  { field: 'guardName', headerName: 'Guard Name', flex: 1.5 },
  { field: 'createdAt', headerName: 'Created At', flex: 1 },
];

export function PermissionsList({ initialPermissions, initialPaginationOptions }: Props) {
  const getPermissions = useMemo(
    () => clientContainer.get<GetPermissions>(SYMBOLS.GetPermissions),
    [],
  );
  const initPermissions = initialPermissions.map(PermissionMapper.fromDtoToDomain);
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<Permission[]>(initPermissions);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initPermissions.length,
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
      const result = await getPermissions.execute(undefined, newPaginationOptions);

      match(result, {
        onRight: ([newRows, nextPaginationOptions]) => {
          setRows(newRows);
          setPaginationOptions(nextPaginationOptions);
          setPaginationMeta({ hasNextPage: Boolean(nextPaginationOptions.nextCursor) });

          let page;
          if (newPaginationModel.page === 0 && nextPaginationOptions.previousCursor) {
            page = 1;
          } else {
            page = newPaginationModel.page;
          }

          setPaginationModel({ page, pageSize: newPaginationModel.pageSize });
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
    router.push(`/permissions/${params.row.id}`);
  };

  return (
    <Box component="section" className="w-full px-6">
      <Container
        maxWidth={false}
        sx={{ bgcolor: 'surface.main' }}
        className="w-full rounded-2xl p-4"
      >
        <NoSsr>
          <DataGrid
            sx={{
              '.MuiTablePagination-displayedRows': { display: 'none' },
              '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
            }}
            columns={columns}
            rows={rows.map((permission) => ({
              id: permission.id,
              name: permission.name,
              guardName: permission.guardName,
              createdAt: permission.createdAt.toLocaleDateString(),
            }))}
            slots={{ noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'] }}
            slotProps={{ noRowsOverlay: { text: 'No permissions found.' } }}
            pageSizeOptions={[25, 50, 100]}
            paginationMode="server"
            loading={isLoading}
            rowCount={rowCount}
            paginationMeta={paginationMeta}
            paginationModel={paginationModel}
            onRowCountChange={setRowCount}
            onPaginationModelChange={handlePaginationModelChange}
            onRowClick={handleRowClick}
            disableRowSelectionOnClick
          />
        </NoSsr>
      </Container>
    </Box>
  );
}
