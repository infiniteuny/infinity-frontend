'use client';

import { Box, Container, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  DataGrid,
  GridPaginationMeta,
  GridPaginationModel,
  GridRowParams,
  GridSlots,
} from '@mui/x-data-grid';
import { EmptyRowOverlay } from '@app/presentation/components/internal/shared';
import { FundApplication, PaginationOptions } from '@app/domain/entities';
import { GetFundApplications } from '@app/application';
import {
  FundApplicationDto,
  FundApplicationMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  initialFundApplications: FundApplicationDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function FundApplicationsList({ initialFundApplications, initialPaginationOptions }: Props) {
  const getFundApplications = useMemo(
    () => clientContainer.get<GetFundApplications>(SYMBOLS.GetFundApplications),
    [],
  );
  const initFundApplications = initialFundApplications.map(FundApplicationMapper.fromDtoToDomain);
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<FundApplication[]>(initFundApplications);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initFundApplications.length,
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
      const result = await getFundApplications.execute(undefined, undefined, newPaginationOptions);

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
    router.push(`/fund-applications/${params.row.id}`);
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
                field: 'letterOfAcceptance',
                headerName: 'LoA',
                flex: 0.5,
              },
              {
                field: 'proposal',
                headerName: 'Proposal',
                flex: 0.5,
              },
              {
                field: 'status',
                headerName: 'Status',
                flex: 1,
              },
            ]}
            rows={rows.map((fundApplication) => ({
              id: fundApplication.id,
              team: fundApplication.team?.name || 'N/A',
              competition: fundApplication.competition?.name || 'N/A',
              competitionScale: fundApplication.competitionScale?.name || 'N/A',
              competitionBranch: fundApplication.competitionBranch,
              competitionStartDate: fundApplication.competitionStartDate.toLocaleDateString(),
              competitionEndDate: fundApplication.competitionEndDate.toLocaleDateString(),
              letterOfAcceptance: fundApplication.letterOfAcceptance,
              proposal: fundApplication.proposal,
              status: fundApplication.status,
            }))}
            slots={{
              noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
            }}
            slotProps={{
              noRowsOverlay: { text: 'No fund applications found.' },
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
