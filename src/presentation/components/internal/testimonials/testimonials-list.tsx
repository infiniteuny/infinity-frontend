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
import { GetTestimonials } from '@app/application';
import { PaginationOptions, Testimonial } from '@app/domain/entities';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  TestimonialDto,
  TestimonialMapper,
} from '@app/infrastructure/dtos';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  initialTestimonials: TestimonialDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function TestimonialsList({ initialTestimonials, initialPaginationOptions }: Props) {
  const initTestimonials = initialTestimonials.map(TestimonialMapper.fromDtoToDomain);
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const getTestimonials = useMemo(
    () => clientContainer.get<GetTestimonials>(SYMBOLS.GetTestimonials),
    [],
  );
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<Testimonial[]>(initTestimonials);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initTestimonials.length,
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
      const result = await getTestimonials.execute(undefined, newPaginationOptions);

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
    router.push(`/testimonials/${params.row.id}`);
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
                field: 'name',
                headerName: 'Name',
                flex: 2,
              },
              {
                field: 'position',
                headerName: 'Position',
                flex: 1,
              },
              {
                field: 'photo',
                headerName: 'Photo',
                flex: 0.5,
              },
              {
                field: 'content',
                headerName: 'Content',
                flex: 2.5,
              },
            ]}
            rows={rows.map((testimonial) => ({
              id: testimonial.id,
              name: testimonial.name,
              position: testimonial.position,
              photo: testimonial.photo,
              content: testimonial.content,
            }))}
            slots={{
              noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
            }}
            slotProps={{
              noRowsOverlay: { text: 'No testimonials found.' },
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
