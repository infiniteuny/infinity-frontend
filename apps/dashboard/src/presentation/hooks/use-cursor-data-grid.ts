import { Either, match } from 'effect/Either';
import {
  GridFilterModel,
  GridPaginationMeta,
  GridPaginationModel,
  GridSortModel,
  useGridApiRef,
} from '@mui/x-data-grid';
import { PaginationOptions } from '@infiniteuny/infinity-domain';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@infiniteuny/infinity-infrastructure/dtos';
import { useCallback, useEffect, useRef, useState } from 'react';

type FetchPageParams = {
  filterModel: GridFilterModel;
  sortModel: GridSortModel;
  pageSize: number;
  cursor?: string;
  abortSignal: AbortSignal;
};

type UseCursorDataGridOptions<T extends { id: string }> = {
  initialRows: () => T[];
  initialRowCount: number;
  initialPaginationOptions: PaginationOptionsDto;
  fetchPage: (params: FetchPageParams) => Promise<Either<[T[], PaginationOptions], Error>>;
  deleteRow: (id: string, rows: T[]) => Promise<Either<unknown, Error> | null>;
  entityLabel: string;
};

export function useCursorDataGrid<T extends { id: string }>({
  initialRows,
  initialRowCount,
  initialPaginationOptions,
  fetchPage,
  deleteRow,
  entityLabel,
}: UseCursorDataGridOptions<T>) {
  const [initPaginationOptions] = useState(() =>
    PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState<T[]>(initialRows);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initialRowCount,
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

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPageRef = useRef(fetchPage);
  const deleteRowRef = useRef(deleteRow);

  useEffect(() => {
    fetchPageRef.current = fetchPage;
  }, [fetchPage]);

  useEffect(() => {
    deleteRowRef.current = deleteRow;
  }, [deleteRow]);

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
    }
    lastFetchedStateRef.current = stateString;

    const controller = new AbortController();

    (async () => {
      setIsLoading(true);
      try {
        const result = await fetchPageRef.current({
          filterModel,
          sortModel,
          pageSize: paginationModel.pageSize,
          cursor,
          abortSignal: controller.signal,
        });

        if (controller.signal.aborted) return;

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
            console.error(`Failed to fetch ${entityLabel}:`, error);
          },
        });
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(`Failed to fetch ${entityLabel}:`, error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, [paginationModel, sortModel, filterModel, cursor, entityLabel]);

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

  const handleDeleteClick = useCallback((id: string, name?: string) => {
    setSelectedId(id);
    setSelectedName(name || null);
    setOpenDeleteDialog(true);
  }, []);

  const handleDeleteAccept = useCallback(async () => {
    if (!selectedId || isDeleting) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteRowRef.current(selectedId, rows);
      if (result) {
        match(result, {
          onRight: () => {
            setRows((prevRows) => prevRows.filter((row) => row.id !== selectedId));
          },
          onLeft: (error) => {
            console.error(`Failed to delete ${entityLabel}:`, error);
          },
        });
      }
    } catch (error) {
      console.error(`Failed to delete ${entityLabel}:`, error);
    } finally {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
    }
  }, [entityLabel, isDeleting, rows, selectedId]);

  const handleDeleteCancel = useCallback(() => {
    if (isDeleting) return;
    setOpenDeleteDialog(false);
  }, [isDeleting]);

  const handleDeleteDialogExited = useCallback(() => {
    setSelectedId(null);
    setSelectedName(null);
  }, []);

  return {
    rows,
    setRows,
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
    selectedId,
    selectedName,
    isDeleting,
    handleDeleteClick,
    handleDeleteAccept,
    handleDeleteCancel,
    handleDeleteDialogExited,
  };
}
