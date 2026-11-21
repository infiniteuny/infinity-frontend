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
  ProjectGallery,
  ProjectGalleryFilterOptions,
  ProjectGallerySortOptions,
} from '@infiniteuny/infinity-domain';
import {
  ProjectGalleryDto,
  ProjectGalleryMapper,
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
import { DeleteProjectGallery, GetProjectGalleries } from '@infiniteuny/infinity-application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { SYMBOLS } from '@config';
import { useCursorDataGrid, useUserPermissions } from '@app/presentation/hooks';
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ProjectGalleriesToolbar } from './project-galleries-toolbar';

const DATA_GRID_SX: DataGridProps['sx'] = {
  '.MuiTablePagination-displayedRows': { display: 'none' },
  '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
};

const DATA_GRID_SLOTS: Partial<GridSlots> = {
  noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
};

const DATA_GRID_SLOT_PROPS: DataGridProps['slotProps'] = {
  noRowsOverlay: { text: 'No project galleries found.' },
  loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' },
};

const DATA_GRID_PAGE_SIZE_OPTIONS = [25, 50, 100];

const DATA_GRID_INITIAL_STATE: DataGridProps['initialState'] = {
  columns: { columnVisibilityModel: { id: false, description: false } },
};

type Props = {
  initialProjectGalleries: ProjectGalleryDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function ProjectGalleriesList({ initialProjectGalleries, initialPaginationOptions }: Props) {
  const getProjectGalleries = useMemo(
    () => clientContainer.get<GetProjectGalleries>(SYMBOLS.GetProjectGalleries),
    [],
  );
  const deleteProjectGallery = useMemo(
    () => clientContainer.get<DeleteProjectGallery>(SYMBOLS.DeleteProjectGallery),
    [],
  );
  const router = useRouter();
  const userPermissions = useUserPermissions();
  const convertSortModelToDomain = (
    model: GridSortModel,
  ): ProjectGallerySortOptions | undefined => {
    if (model.length === 0) return undefined;
    const fieldMap: Record<string, keyof ProjectGallerySortOptions> = { id: 'id', title: 'title' };
    const sortOptions: ProjectGallerySortOptions = {};
    for (const sortItem of model) {
      const d = fieldMap[sortItem.field];
      if (d) sortOptions[d] = sortItem.sort === 'asc' ? 'ASC' : 'DESC';
    }
    return Object.keys(sortOptions).length > 0 ? sortOptions : undefined;
  };

  const convertFilterModelToDomain = (
    model: GridFilterModel,
  ): ProjectGalleryFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;
    const f: ProjectGalleryFilterOptions = {};
    for (const i of model.items) {
      if (i.field === 'title' && i.value != null) f.title = String(i.value);
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
  } = useCursorDataGrid<ProjectGallery>({
    initialRows: () => initialProjectGalleries.map(ProjectGalleryMapper.fromDtoToDomain),
    initialRowCount: initialProjectGalleries.length,
    initialPaginationOptions,
    fetchPage: ({ filterModel, sortModel, pageSize, cursor, abortSignal }) =>
      getProjectGalleries.execute(
        convertFilterModelToDomain(filterModel),
        convertSortModelToDomain(sortModel),
        { perPage: pageSize, cursor },
        abortSignal,
      ),
    deleteRow: (id) => deleteProjectGallery.execute(id),
    entityLabel: 'project galleries',
  });

  const handleRowClick = useCallback(
    (p: GridRowParams) => {
      router.push(`/project-galleries/${p.row.id}`);
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
        field: 'title',
        headerName: 'Title',
        flex: 2,
        minWidth: 200,
        filterable: true,
        sortable: true,
        filterOperators: [StringOperators.contains],
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 2,
        minWidth: 400,
        filterable: false,
        sortable: false,
      },
      {
        field: 'url',
        headerName: 'URL',
        flex: 2,
        minWidth: 300,
        filterable: false,
        sortable: false,
      },
      {
        field: 'image',
        headerName: 'Image',
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
              href={`/project-galleries/${p.row.actions.id}`}
            />
            {['update-project-gallery'].some((x) => userPermissions.has(x)) ? (
              <GridActionsCellItem
                key="edit"
                showInMenu
                icon={<EditRounded />}
                label="Edit"
                component={Link}
                href={`/project-galleries/${p.row.actions.id}/edit`}
              />
            ) : null}
            {['delete-project-gallery'].some((x) => userPermissions.has(x)) ? (
              <GridActionsCellItem
                key="delete"
                showInMenu
                icon={<DeleteRounded />}
                label="Delete"
                onClick={() => handleDeleteClick(p.row.actions.id, p.row.actions.title)}
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
        title: x.title,
        description: x.description,
        url: x.url,
        image: x.image,
        actions: x,
      })),
    [rows],
  );

  return (
    <>
      <SectionHeader title="Project Galleries">
        <ProjectGalleriesToolbar dataGridApiRef={dataGridApiRef} />
      </SectionHeader>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        onExited={handleDeleteDialogExited}
        isLoading={isDeleting}
        confirmColor="error"
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedName || 'this project gallery'}? This action cannot be undone.`}
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
