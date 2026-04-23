'use client';

import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  DataGrid,
  GridPaginationMeta,
  GridPaginationModel,
  GridRowParams,
  GridSlots,
} from '@mui/x-data-grid';
import { CompetitionScale, PaginationOptions } from '@app/domain/entities';
import { EmptyRowOverlay } from '@app/presentation/components/internal/shared';
import { GetCompetitionScales } from '@app/application';
import {
  CompetitionScaleDto,
  CompetitionScaleMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  initialCompetitionScales: CompetitionScaleDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function CompetitionScalesList({
  initialCompetitionScales,
  initialPaginationOptions,
}: Props) {
  const getCompetitionScales = useMemo(
    () => clientContainer.get<GetCompetitionScales>(SYMBOLS.GetCompetitionScales),
    [],
  );
  const initCompetitionScales = initialCompetitionScales.map(
    CompetitionScaleMapper.fromDtoToDomain,
  );
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<CompetitionScale[]>(initCompetitionScales);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initCompetitionScales.length,
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
      const result = await getCompetitionScales.execute(undefined, {
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
    router.push(`/competition-scales/${params.row.id}`);
  };

  return (
    <Box component="section" className="mb-6 w-full px-6">
      <NoSsr>
        <DataGrid
          sx={{
            '.MuiTablePagination-displayedRows': { display: 'none' },
            '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
          }}
          columns={[
            { field: 'id', headerName: 'ID', flex: 1 },
            { field: 'name', headerName: 'Name', flex: 2 },
            { field: 'weight', headerName: 'Weight', flex: 1 },
          ]}
          rows={rows.map((scale) => ({
            id: scale.id,
            name: scale.name,
            weight: scale.weight,
          }))}
          slots={{
            noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
          }}
          slotProps={{
            noRowsOverlay: { text: 'No competition scales found.' },
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
