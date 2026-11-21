'use client';

import Link from 'next/link';
import {
  AlertDialog,
  DegreeFilterInput,
  EmptyRowOverlay,
  FacultyFilterInput,
  SectionHeader,
  StringOperators,
} from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
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
import { DeleteMajor, GetMajors } from '@infiniteuny/infinity-application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import {
  Major,
  MajorFilterOptions,
  MajorSortOptions,
  PaginationOptions,
} from '@infiniteuny/infinity-domain';
import {
  MajorDto,
  MajorMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@infiniteuny/infinity-infrastructure';
import { match } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useUserPermissions } from '@app/presentation/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MajorsToolbar } from './majors-toolbar';

const DATA_GRID_SX: DataGridProps['sx'] = {
  '.MuiTablePagination-displayedRows': { display: 'none' },
  '.MuiDataGrid-row': { '&:hover': { cursor: 'pointer' } },
};

const DATA_GRID_SLOTS: Partial<GridSlots> = {
  noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
};

const DATA_GRID_SLOT_PROPS: DataGridProps['slotProps'] = {
  noRowsOverlay: { text: 'No majors found.' },
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
  initialMajors: MajorDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function MajorsList({ initialMajors, initialPaginationOptions }: Props) {
  const getMajors = useMemo(() => clientContainer.get<GetMajors>(SYMBOLS.GetMajors), []);
  const deleteMajor = useMemo(() => clientContainer.get<DeleteMajor>(SYMBOLS.DeleteMajor), []);
  const router = useRouter();
  const userPermissions = useUserPermissions();

  const [initPaginationOptions] = useState(() =>
    PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions),
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<Major[]>(() => initialMajors.map(MajorMapper.fromDtoToDomain));
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initialMajors.length,
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
  const [selectedMajorId, setSelectedMajorId] = useState<string | null>(null);
  const [selectedMajorName, setSelectedMajorName] = useState<string | null>(null);

  const convertSortModelToDomain = (model: GridSortModel): MajorSortOptions | undefined => {
    if (model.length === 0) return undefined;

    const fieldMap: Record<string, keyof MajorSortOptions> = {
      id: 'id',
      name: 'name',
      code: 'code',
    };

    const sortOptions: MajorSortOptions = {};
    for (const sortItem of model) {
      const domainField = fieldMap[sortItem.field];
      if (domainField) {
        sortOptions[domainField] = sortItem.sort === 'asc' ? 'ASC' : 'DESC';
      }
    }

    return Object.keys(sortOptions).length > 0 ? sortOptions : undefined;
  };

  const convertFilterModelToDomain = (model: GridFilterModel): MajorFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;

    const filterOptions: MajorFilterOptions = {};

    for (const filterItem of model.items) {
      switch (filterItem.field) {
        case 'name':
          if (filterItem.value != null) {
            filterOptions.name = String(filterItem.value);
          }
          break;
        case 'code':
          if (filterItem.value != null) {
            filterOptions.code = String(filterItem.value);
          }
          break;
        case 'degree':
          if (filterItem.value != null) {
            filterOptions.degreeId = String(filterItem.value);
          }
          break;
        case 'faculty':
          if (filterItem.value != null) {
            filterOptions.facultyId = String(filterItem.value);
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
        const result = await getMajors.execute(['degree', 'faculty'], filterOptions, sortOptions, {
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
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [paginationModel, sortModel, filterModel, cursor, getMajors]);

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
      router.push(`/majors/${params.row.id}`);
    },
    [router],
  );

  const handleDeleteClick = useCallback((majorId: string, majorName?: string) => {
    setSelectedMajorId(majorId);
    setSelectedMajorName(majorName || null);
    setOpenDeleteDialog(true);
  }, []);

  const handleDeleteAccept = async () => {
    if (!selectedMajorId) {
      console.error('No major selected for deletion');
      return;
    }

    const result = await deleteMajor.execute(selectedMajorId);
    match(result, {
      onRight: () => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedMajorId));
      },
      onLeft: (error) => {
        console.error('Failed to delete major:', error);
      },
    });

    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedMajorId(null);
      setSelectedMajorName(null);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedMajorId(null);
      setSelectedMajorName(null);
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
        field: 'code',
        headerName: 'Code',
        flex: 1,
        minWidth: 120,
        filterable: true,
        sortable: true,
        filterOperators: [StringOperators.equals],
      },
      {
        field: 'degree',
        headerName: 'Degree',
        flex: 1.5,
        minWidth: 170,
        filterable: true,
        sortable: false,
        filterOperators: [
          {
            label: 'is',
            value: 'is',
            getApplyFilterFn: (filterItem) => {
              if (!filterItem.field || !filterItem.value || !filterItem.operator) {
                return null;
              }

              return (value) => {
                return value === filterItem.value;
              };
            },
            InputComponent: DegreeFilterInput,
          },
        ],
      },
      {
        field: 'faculty',
        headerName: 'Faculty',
        flex: 1.5,
        minWidth: 170,
        filterable: true,
        sortable: false,
        filterOperators: [
          {
            label: 'is',
            value: 'is',
            getApplyFilterFn: (filterItem) => {
              if (!filterItem.field || !filterItem.value || !filterItem.operator) {
                return null;
              }

              return (value) => {
                return value === filterItem.value;
              };
            },
            InputComponent: FacultyFilterInput,
          },
        ],
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
              href={`/majors/${params.row.actions.id}`}
            />
            {['update-major'].some((p) => userPermissions.has(p)) ? (
              <GridActionsCellItem
                key="edit"
                showInMenu
                icon={<EditRounded />}
                label="Edit"
                component={Link}
                href={`/majors/${params.row.actions.id}/edit`}
              />
            ) : null}
            {['delete-major'].some((p) => userPermissions.has(p)) ? (
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
      rows.map((major) => ({
        id: major.id,
        code: major.code,
        name: major.name,
        degree: major.degree?.name || 'N/A',
        faculty: major.faculty?.name || 'N/A',
        actions: major,
      })),
    [rows],
  );

  return (
    <>
      <SectionHeader title="Majors" backUrl="/settings">
        <MajorsToolbar dataGridApiRef={dataGridApiRef} />
      </SectionHeader>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedMajorName || 'this major'}? This action cannot be undone.`}
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
