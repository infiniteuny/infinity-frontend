'use client';

import { Achievement, PaginationOptions } from '@app/domain/entities';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  DataGrid,
  GridPaginationMeta,
  GridPaginationModel,
  GridRowParams,
  GridSlots,
} from '@mui/x-data-grid';
import { EmptyRowOverlay } from '@app/presentation/components/internal/shared';
import { GetAchievements } from '@app/application';
import {
  AchievementDto,
  AchievementMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  initialAchievements: AchievementDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

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
      const result = await getAchievements.execute(undefined, undefined, {
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
    router.push(`/achievements/${params.row.id}`);
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
            {
              field: 'id',
              headerName: 'ID',
              flex: 1,
            },
            {
              field: 'team',
              headerName: 'Team',
              flex: 1,
            },
            {
              field: 'competition',
              headerName: 'Competition',
              flex: 2,
            },
            {
              field: 'competitionScale',
              headerName: 'Scale',
              flex: 1,
            },
            {
              field: 'competitionTimeRange',
              headerName: 'Time Range',
              flex: 1,
            },
            {
              field: 'competitionOutput',
              headerName: 'Output',
              flex: 1,
            },
            {
              field: 'competitionRank',
              headerName: 'Rank',
              flex: 1,
            },
            {
              field: 'competitionBranch',
              headerName: 'Branch',
              flex: 2,
            },
            {
              field: 'competitionStartDate',
              headerName: 'Start Date',
              flex: 1,
            },
            {
              field: 'competitionEndDate',
              headerName: 'End Date',
              flex: 1,
            },
            {
              field: 'image',
              headerName: 'Image',
              flex: 0.5,
            },
            {
              field: 'status',
              headerName: 'Status',
              flex: 1,
            },
          ]}
          rows={rows.map((achievement) => ({
            id: achievement.id,
            team: achievement.team?.name || 'N/A',
            competition: achievement.competitionInstance?.name || 'N/A',
            competitionScale: achievement.competitionScale?.name || 'N/A',
            competitionTimeRange: achievement.competitionTimeRange?.name || 'N/A',
            competitionOutput: achievement.competitionOutput?.name || 'N/A',
            competitionRank: achievement.competitionRank?.name || 'N/A',
            competitionBranch: achievement.competitionBranch,
            competitionStartDate: achievement.competitionStartDate.toLocaleDateString(),
            competitionEndDate: achievement.competitionEndDate.toLocaleDateString(),
            status: achievement.status,
          }))}
          slots={{
            noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
          }}
          slotProps={{
            noRowsOverlay: { text: 'No achievements found.' },
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
