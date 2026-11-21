'use client';

import Link from 'next/link';
import {
  AlertDialog,
  EmptyRowOverlay,
  SectionHeader,
  StringOperators,
} from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  Testimonial,
  TestimonialFilterOptions,
  TestimonialSortOptions,
} from '@infiniteuny/infinity-domain';
import {
  TestimonialDto,
  TestimonialMapper,
  PaginationOptionsDto,
} from '@infiniteuny/infinity-infrastructure/dtos';
import {
  DataGrid,
  DataGridProps,
  GridActionsCell,
  GridActionsCellItem,
  GridColDef,
  GridFilterModel,
  GridRowParams,
  GridSlots,
  GridSortModel,
} from '@mui/x-data-grid';
import { DeleteTestimonial, GetTestimonials } from '@infiniteuny/infinity-application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { SYMBOLS } from '@config';
import { useCursorDataGrid, useUserPermissions } from '@app/presentation/hooks';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TestimonialsToolbar } from './testimonials-toolbar';

const DATA_GRID_SX: DataGridProps['sx'] = {
  '.MuiTablePagination-displayedRows': { display: 'none' },
  '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
};

const DATA_GRID_SLOTS: Partial<GridSlots> = {
  noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
};

const DATA_GRID_SLOT_PROPS: DataGridProps['slotProps'] = {
  noRowsOverlay: { text: 'No testimonials found.' },
  loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' },
};

const DATA_GRID_PAGE_SIZE_OPTIONS = [25, 50, 100];

const DATA_GRID_INITIAL_STATE: DataGridProps['initialState'] = {
  columns: { columnVisibilityModel: { id: false, content: false } },
};

type Props = {
  initialTestimonials: TestimonialDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function TestimonialsList({ initialTestimonials, initialPaginationOptions }: Props) {
  const getTestimonials = useMemo(
    () => clientContainer.get<GetTestimonials>(SYMBOLS.GetTestimonials),
    [],
  );
  const deleteTestimonial = useMemo(
    () => clientContainer.get<DeleteTestimonial>(SYMBOLS.DeleteTestimonial),
    [],
  );
  const router = useRouter();
  const userPermissions = useUserPermissions();
  const convertSortModelToDomain = (model: GridSortModel): TestimonialSortOptions | undefined => {
    if (model.length === 0) return undefined;
    const fieldMap: Record<string, keyof TestimonialSortOptions> = {
      id: 'id',
      name: 'name',
      position: 'position',
    };
    const sortOptions: TestimonialSortOptions = {};
    for (const sortItem of model) {
      const d = fieldMap[sortItem.field];
      if (d) sortOptions[d] = sortItem.sort === 'asc' ? 'ASC' : 'DESC';
    }
    return Object.keys(sortOptions).length > 0 ? sortOptions : undefined;
  };

  const convertFilterModelToDomain = (
    model: GridFilterModel,
  ): TestimonialFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;
    const f: TestimonialFilterOptions = {};
    for (const i of model.items) {
      if (i.field === 'name' && i.value != null) f.name = String(i.value);
      if (i.field === 'position' && i.value != null) f.position = String(i.value);
    }
    return Object.keys(f).length > 0 ? f : undefined;
  };

  const {
    rows,
    rowCount,
    isLoading,
    filterModel,
    paginationModel,
    sortModel,
    paginationMeta,
    dataGridApiRef,
    handlePaginationModelChange,
    handleSortModelChange,
    handleFilterModelChange,
    openDeleteDialog,
    selectedName,
    isDeleting,
    handleDeleteClick,
    handleDeleteAccept,
    handleDeleteCancel,
    handleDeleteDialogExited,
  } = useCursorDataGrid<Testimonial>({
    initialRows: () => initialTestimonials.map(TestimonialMapper.fromDtoToDomain),
    initialRowCount: initialTestimonials.length,
    initialPaginationOptions,
    fetchPage: ({ filterModel, sortModel, pageSize, cursor, abortSignal }) =>
      getTestimonials.execute(
        convertFilterModelToDomain(filterModel),
        convertSortModelToDomain(sortModel),
        { perPage: pageSize, cursor },
        abortSignal,
      ),
    deleteRow: (id) => deleteTestimonial.execute(id),
    entityLabel: 'testimonials',
  });

  const handleRowClick = useCallback(
    (p: GridRowParams) => {
      router.push(`/testimonials/${p.row.id}`);
    },
    [router],
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        flex: 1,
        minWidth: 300,
        filterable: false,
        sortable: true,
      },
      {
        field: 'name',
        headerName: 'Name',
        flex: 2,
        minWidth: 200,
        filterable: true,
        sortable: true,
        filterOperators: [StringOperators.contains],
      },
      {
        field: 'position',
        headerName: 'Position',
        flex: 1,
        minWidth: 150,
        filterable: true,
        sortable: true,
        filterOperators: [StringOperators.contains],
      },
      {
        field: 'content',
        headerName: 'Content',
        flex: 2.5,
        minWidth: 400,
        filterable: false,
        sortable: false,
      },
      {
        field: 'photo',
        headerName: 'Photo',
        flex: 0.5,
        minWidth: 100,
        filterable: false,
        sortable: false,
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: '',
        flex: 0.5,
        minWidth: 50,
        maxWidth: 50,
        renderCell: (p) => (
          <GridActionsCell {...p}>
            <GridActionsCellItem
              key="view"
              showInMenu
              icon={<VisibilityRounded />}
              label="View"
              component={Link}
              href={`/testimonials/${p.row.actions.id}`}
            />
            {['update-testimonial'].some((x) => userPermissions.has(x)) ? (
              <GridActionsCellItem
                key="edit"
                showInMenu
                icon={<EditRounded />}
                label="Edit"
                component={Link}
                href={`/testimonials/${p.row.actions.id}/edit`}
              />
            ) : null}
            {['delete-testimonial'].some((x) => userPermissions.has(x)) ? (
              <GridActionsCellItem
                key="delete"
                showInMenu
                icon={<DeleteRounded />}
                label="Delete"
                onClick={() => handleDeleteClick(p.row.actions.id, p.row.actions.name)}
              />
            ) : null}
          </GridActionsCell>
        ),
      },
    ],
    [userPermissions, handleDeleteClick],
  );

  const gridRows = useMemo(
    () =>
      rows.map((x) => ({
        id: x.id,
        name: x.name,
        position: x.position,
        photo: x.photo,
        content: x.content,
        actions: x,
      })),
    [rows],
  );

  return (
    <>
      <SectionHeader title="Testimonials">
        <TestimonialsToolbar dataGridApiRef={dataGridApiRef} />
      </SectionHeader>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        onExited={handleDeleteDialogExited}
        isLoading={isDeleting}
        confirmColor="error"
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedName || 'this testimonial'}? This action cannot be undone.`}
        acceptText="Delete"
        cancelText="Cancel"
      />
      <Box component="section" className="mb-6 w-full px-6">
        <NoSsr>
          <DataGrid
            sx={DATA_GRID_SX}
            columns={columns}
            rows={gridRows}
            slots={DATA_GRID_SLOTS}
            slotProps={DATA_GRID_SLOT_PROPS}
            pageSizeOptions={DATA_GRID_PAGE_SIZE_OPTIONS}
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            initialState={DATA_GRID_INITIAL_STATE}
            loading={isLoading}
            rowCount={rowCount}
            apiRef={dataGridApiRef}
            paginationMeta={paginationMeta}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationModelChange}
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            filterModel={filterModel}
            onFilterModelChange={handleFilterModelChange}
            onRowClick={handleRowClick}
            disableRowSelectionOnClick
          />
        </NoSsr>
      </Box>
    </>
  );
}
