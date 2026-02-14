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
import { GetAchievements } from '@app/application';
import { clientContainer } from '@app/client-injection';
import { Achievement, PaginationOptions } from '@app/domain/entities';
import {
  AchievementDto,
  AchievementMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { EmptyRowOverlay } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type Props = {
  initialAchievements: AchievementDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 1 },
  { field: 'competitionBranch', headerName: 'Competition Branch', flex: 1.5 },
  { field: 'status', headerName: 'Status', flex: 1 },
  { field: 'startDate', headerName: 'Start Date', flex: 1 },
  { field: 'endDate', headerName: 'End Date', flex: 1 },
];

export function AchievementsList({ initialAchievements, initialPaginationOptions }: Props) {
  const getAchievements = useMemo(
    () => clientContainer.get<GetAchievements>(SYMBOLS.GetAchievements),
    [],
  );
  const initAchievements = initialAchievements.map(AchievementMapper.fromDtoToDomain);
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<Achievement[]>(initAchievements);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initAchievements.length,
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
      const result = await getAchievements.execute(undefined, newPaginationOptions);

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
    router.push(`/achievements/${params.row.id}`);
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
            rows={rows.map((achievement) => ({
              id: achievement.id,
              competitionBranch: achievement.competitionBranch,
              status: achievement.status,
              startDate: achievement.competitionStartDate.toLocaleDateString(),
              endDate: achievement.competitionEndDate.toLocaleDateString(),
            }))}
            slots={{ noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'] }}
            slotProps={{ noRowsOverlay: { text: 'No achievements found.' } }}
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
