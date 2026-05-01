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
import { GetUserPersonas } from '@app/application';
import { match } from 'effect/Either';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserPersonaDto,
  UserPersonaMapper,
} from '@app/infrastructure/dtos';
import { SYMBOLS } from '@config';
import { PaginationOptions, UserPersona } from '@app/domain/entities';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  initialUserPersonas: UserPersonaDto[];
  initialPaginationOptions: PaginationOptionsDto;
  userId: string;
};

export function UserPersonasList({ initialUserPersonas, initialPaginationOptions, userId }: Props) {
  const initUserPersonas = initialUserPersonas.map(UserPersonaMapper.fromDtoToDomain);
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const getUserPersonas = useMemo(
    () => clientContainer.get<GetUserPersonas>(SYMBOLS.GetUserPersonas),
    [],
  );
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<UserPersona[]>(initUserPersonas);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initUserPersonas.length,
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
      const result = await getUserPersonas.execute(userId, undefined, {
        perPage: normalizedPaginationModel.pageSize,
        cursor,
      });

      match(result, {
        onRight: (data) => {
          const newRows = Array.isArray(data) ? data[0] : data;
          const nextPaginationOptions = Array.isArray(data) ? data[1] : undefined;

          if (!nextPaginationOptions) {
            setRows(newRows);
            return;
          }

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
    router.push(`/personas/${params.row.id}`);
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
              flex: 3,
            },
            {
              field: 'priority',
              headerName: 'Priority',
              flex: 1,
            },
            {
              field: 'description',
              headerName: 'Description',
              flex: 3,
            },
          ]}
          rows={rows.map((userPersona) => ({
            id: userPersona.id,
            name: userPersona.name,
            priority: userPersona.priority,
            description: userPersona.description,
          }))}
          slots={{
            noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
          }}
          slotProps={{
            noRowsOverlay: { text: 'No user personas found.' },
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
  );
}
