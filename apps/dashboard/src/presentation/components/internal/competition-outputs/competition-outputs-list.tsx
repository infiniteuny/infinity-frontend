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
  CompetitionOutput,
  CompetitionOutputFilterOptions,
  CompetitionOutputSortOptions,
  PaginationOptions,
} from '@infiniteuny/infinity-domain';
import {
  CompetitionOutputDto,
  CompetitionOutputMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@infiniteuny/infinity-infrastructure';
import {
  DataGrid,
  DataGridProps,
  GridActionsCell,
  GridActionsCellItem,
  GridColDef,
  GridFilterModel,
  GridPaginationMeta,
  GridPaginationModel,
  GridRowParams,
  GridSlots,
  GridSortModel,
  useGridApiRef,
} from '@mui/x-data-grid';
import { DeleteCompetitionOutput, GetCompetitionOutputs } from '@infiniteuny/infinity-application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useUserPermissions } from '@app/presentation/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CompetitionOutputsToolbar } from './competition-outputs-toolbar';

const DATA_GRID_SX: DataGridProps['sx'] = {
  '.MuiTablePagination-displayedRows': { display: 'none' },
  '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
};

const DATA_GRID_SLOTS: Partial<GridSlots> = {
  noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
};

const DATA_GRID_SLOT_PROPS: DataGridProps['slotProps'] = {
  noRowsOverlay: { text: 'No competition outputs found.' },
  loadingOverlay: {
    variant: 'skeleton',
    noRowsVariant: 'skeleton',
  },
};

const DATA_GRID_PAGE_SIZE_OPTIONS = [25, 50, 100];

const DATA_GRID_INITIAL_STATE: DataGridProps['initialState'] = {
  columns: {
    columnVisibilityModel: {
      id: false,
    },
  },
};

type Props = {
  initialCompetitionOutputs: CompetitionOutputDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function CompetitionOutputsList({
  initialCompetitionOutputs,
  initialPaginationOptions,
}: Props) {
  const getCompetitionOutputs = useMemo(
    () => clientContainer.get<GetCompetitionOutputs>(SYMBOLS.GetCompetitionOutputs),
    [],
  );
  const deleteCompetitionOutput = useMemo(
    () => clientContainer.get<DeleteCompetitionOutput>(SYMBOLS.DeleteCompetitionOutput),
    [],
  );
  const router = useRouter();
  const userPermissions = useUserPermissions();

  const [initPaginationOptions] = useState(() =>
    PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions),
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<CompetitionOutput[]>(() =>
    initialCompetitionOutputs.map(CompetitionOutputMapper.fromDtoToDomain),
  );
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initialCompetitionOutputs.length,
  );
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: initPaginationOptions.previousCursor ? 1 : 0,
    pageSize: initPaginationOptions.perPage || 25,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [paginationMeta, setPaginationMeta] = useState<GridPaginationMeta>({
    hasNextPage: Boolean(initPaginationOptions.nextCursor),
  });
  const [paginationOptions, setPaginationOptions] =
    useState<Pick<PaginationOptions, 'cursor' | 'nextCursor' | 'previousCursor'>>(
      initPaginationOptions,
    );
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const isInitialMount = useRef(true);
  const lastFetchedStateRef = useRef<string>(
    JSON.stringify({
      filters: [],
      sort: [],
      pagination: {
        page: initPaginationOptions.previousCursor ? 1 : 0,
        pageSize: initPaginationOptions.perPage || 25,
      },
    }),
  );
  const dataGridApiRef = useGridApiRef();

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null);
  const [selectedOutputName, setSelectedOutputName] = useState<string | null>(null);

  const convertSortModelToDomain = (
    model: GridSortModel,
  ): CompetitionOutputSortOptions | undefined => {
    if (model.length === 0) return undefined;
    const fieldMap: Record<string, keyof CompetitionOutputSortOptions> = {
      id: 'id',
      name: 'name',
      weight: 'weight',
    };
    const sortOptions: CompetitionOutputSortOptions = {};
    for (const sortItem of model) {
      const domainField = fieldMap[sortItem.field];
      if (domainField) {
        sortOptions[domainField] = sortItem.sort === 'asc' ? 'ASC' : 'DESC';
      }
    }
    return Object.keys(sortOptions).length > 0 ? sortOptions : undefined;
  };

  const convertFilterModelToDomain = (
    model: GridFilterModel,
  ): CompetitionOutputFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;
    const filterOptions: CompetitionOutputFilterOptions = {};
    for (const filterItem of model.items) {
      switch (filterItem.field) {
        case 'name':
          if (filterItem.value != null) {
            filterOptions.name = String(filterItem.value);
          }
          break;
      }
    }
    return Object.keys(filterOptions).length > 0 ? filterOptions : undefined;
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const stateString = JSON.stringify({
      filters: filterModel.items
        .filter((item) => item.value != null && item.value !== '')
        .map((item) => ({ field: item.field, value: item.value })),
      sort: sortModel,
      pagination: paginationModel,
    });

    if (stateString === lastFetchedStateRef.current) {
      return;
    } else {
      lastFetchedStateRef.current = stateString;
    }

    let cancelled = false;
    (async () => {
      setIsLoading(true);
      const sortOptions = convertSortModelToDomain(sortModel);
      const filterOptions = convertFilterModelToDomain(filterModel);
      try {
        const result = await getCompetitionOutputs.execute(filterOptions, sortOptions, {
          perPage: paginationModel.pageSize,
          cursor,
        });
        if (cancelled) return;
        match(result, {
          onRight: ([newRows, nextPaginationOptions]) => {
            const hasNextPage = Boolean(nextPaginationOptions.nextCursor);
            setRows(newRows);
            setRowCount(
              hasNextPage ? -1 : paginationModel.page * paginationModel.pageSize + newRows.length,
            );
            setPaginationMeta({ hasNextPage });
            setPaginationOptions(nextPaginationOptions);
          },
          onLeft: (error) => {
            throw error;
          },
        });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [paginationModel, sortModel, filterModel, cursor, getCompetitionOutputs]);

  const handlePaginationModelChange = useCallback(
    (newPaginationModel: GridPaginationModel) => {
      const isPageSizeChanged = newPaginationModel.pageSize !== paginationModel.pageSize;
      const normalizedPaginationModel = isPageSizeChanged
        ? { ...newPaginationModel, page: 0 }
        : newPaginationModel;
      let nextCursor: string | undefined;
      if (isPageSizeChanged) {
        nextCursor = undefined;
      } else if (
        normalizedPaginationModel.page > paginationModel.page &&
        paginationOptions.nextCursor
      ) {
        nextCursor = paginationOptions.nextCursor;
      } else if (
        normalizedPaginationModel.page < paginationModel.page &&
        paginationOptions.previousCursor
      ) {
        nextCursor = paginationOptions.previousCursor;
      } else {
        nextCursor = paginationOptions.cursor;
      }
      setCursor(nextCursor);
      setPaginationModel(normalizedPaginationModel);
    },
    [paginationModel, paginationOptions],
  );

  const handleSortModelChange = useCallback((newSortModel: GridSortModel) => {
    setCursor(undefined);
    setPaginationModel((prev) => ({ page: 0, pageSize: prev.pageSize }));
    setSortModel(newSortModel);
  }, []);

  const handleFilterModelChange = useCallback((newFilterModel: GridFilterModel) => {
    setCursor(undefined);
    setPaginationModel((prev) => ({ page: 0, pageSize: prev.pageSize }));
    setFilterModel(newFilterModel);
  }, []);

  const handleRowClick = useCallback(
    (params: GridRowParams) => {
      router.push(`/competition-outputs/${params.row.id}`);
    },
    [router],
  );

  const handleDeleteClick = useCallback((outputId: string, outputName?: string) => {
    setSelectedOutputId(outputId);
    setSelectedOutputName(outputName || null);
    setOpenDeleteDialog(true);
  }, []);

  const handleDeleteAccept = async () => {
    if (!selectedOutputId) {
      console.error('No output selected for deletion');
      return;
    }
    const result = await deleteCompetitionOutput.execute(selectedOutputId);
    match(result, {
      onRight: () => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedOutputId));
      },
      onLeft: (error) => {
        console.error('Failed to delete output:', error);
      },
    });
    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedOutputId(null);
      setSelectedOutputName(null);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedOutputId(null);
      setSelectedOutputName(null);
    }, 1000);
  };

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
        field: 'weight',
        headerName: 'Weight',
        flex: 1,
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
        renderCell: (params) => (
          <GridActionsCell {...params}>
            <GridActionsCellItem
              key="view"
              showInMenu
              icon={<VisibilityRounded />}
              label="View"
              component={Link}
              href={`/competition-outputs/${params.row.actions.id}`}
            />
            {['update-competition-output'].some((p) => userPermissions.has(p)) ? (
              <GridActionsCellItem
                key="edit"
                showInMenu
                icon={<EditRounded />}
                label="Edit"
                component={Link}
                href={`/competition-outputs/${params.row.actions.id}/edit`}
              />
            ) : null}
            {['delete-competition-output'].some((p) => userPermissions.has(p)) ? (
              <GridActionsCellItem
                key="delete"
                showInMenu
                icon={<DeleteRounded />}
                label="Delete"
                onClick={() => handleDeleteClick(params.row.actions.id, params.row.actions.name)}
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
      rows.map((output) => ({
        id: output.id,
        name: output.name,
        weight: output.weight,
        actions: output,
      })),
    [rows],
  );

  return (
    <>
      <SectionHeader title="Outputs" backUrl="/settings">
        <CompetitionOutputsToolbar dataGridApiRef={dataGridApiRef} />
      </SectionHeader>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedOutputName || 'this output'}? This action cannot be undone.`}
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
