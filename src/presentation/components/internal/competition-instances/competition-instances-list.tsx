'use client';

import Link from 'next/link';
import {
  AlertDialog,
  CompetitionOrganizerTypeFilterInput,
  DateOperators,
  EmptyRowOverlay,
  StringOperators,
} from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  CompetitionInstance,
  CompetitionInstanceFilterOptions,
  CompetitionInstanceSortOptions,
  FilterOperator,
  PaginationOptions,
} from '@app/domain/entities';
import {
  CompetitionInstanceDto,
  CompetitionInstanceMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import {
  DataGrid,
  GridActionsCell,
  GridActionsCellItem,
  GridFilterModel,
  GridPaginationMeta,
  GridPaginationModel,
  GridRowParams,
  GridSlots,
  GridSortModel,
} from '@mui/x-data-grid';
import { DeleteCompetitionInstance, GetCompetitionInstances } from '@app/application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useInternalStore } from '@app/presentation/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { convertDateFilterOperator } from '@app/utils';

type Props = {
  initialCompetitionInstances: CompetitionInstanceDto[];
  initialPaginationOptions: PaginationOptionsDto;
  competitionId: string;
};

export function CompetitionInstancesList({
  initialCompetitionInstances,
  initialPaginationOptions,
  competitionId,
}: Props) {
  const getCompetitionInstances = useMemo(
    () => clientContainer.get<GetCompetitionInstances>(SYMBOLS.GetCompetitionInstances),
    [],
  );
  const deleteCompetitionInstance = useMemo(
    () => clientContainer.get<DeleteCompetitionInstance>(SYMBOLS.DeleteCompetitionInstance),
    [],
  );
  const initCompetitionInstances = initialCompetitionInstances.map(
    CompetitionInstanceMapper.fromDtoToDomain,
  );
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = new Set(userSession?.permissions || []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<CompetitionInstance[]>(initCompetitionInstances);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initCompetitionInstances.length,
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

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedCompetitionInstanceId, setSelectedCompetitionInstanceId] = useState<string | null>(
    null,
  );
  const [selectedCompetitionInstanceName, setSelectedCompetitionInstanceName] = useState<
    string | null
  >(null);

  const convertSortModelToDomain = (
    model: GridSortModel,
  ): CompetitionInstanceSortOptions | undefined => {
    if (model.length === 0) return undefined;

    const fieldMap: Record<string, keyof CompetitionInstanceSortOptions> = {
      name: 'name',
      shortname: 'shortname',
      organizer: 'organizer',
      location: 'location',
      startDate: 'startDate',
      endDate: 'endDate',
    };

    const sortOptions: CompetitionInstanceSortOptions = {};
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
  ): CompetitionInstanceFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;

    const filterOptions: CompetitionInstanceFilterOptions = {};

    for (const filterItem of model.items) {
      switch (filterItem.field) {
        case 'name':
          if (filterItem.value != null) {
            filterOptions.name = String(filterItem.value);
          }
          break;
        case 'shortname':
          if (filterItem.value != null) {
            filterOptions.shortname = String(filterItem.value);
          }
          break;
        case 'organizer':
          if (filterItem.value != null) {
            filterOptions.organizer = String(filterItem.value);
          }
          break;
        case 'location':
          if (filterItem.value != null) {
            filterOptions.location = String(filterItem.value);
          }
          break;
        case 'organizerType':
          if (filterItem.value != null) {
            filterOptions.organizerTypeId = String(filterItem.value);
          }
          break;
        case 'startDate':
          if (filterItem.operator === 'isEmpty') {
            filterOptions.startDateOperator = FilterOperator.EQUAL;
            filterOptions.startDate = undefined;
          } else if (filterItem.operator === 'isNotEmpty') {
            filterOptions.startDateOperator = FilterOperator.NOT_EQUAL;
            filterOptions.startDate = undefined;
          } else if (filterItem.value != null) {
            filterOptions.startDate =
              filterItem.value instanceof Date ? filterItem.value : new Date(filterItem.value);
            filterOptions.startDateOperator = convertDateFilterOperator(filterItem.operator);
          }
          break;
        case 'endDate':
          if (filterItem.operator === 'isEmpty') {
            filterOptions.endDateOperator = FilterOperator.EQUAL;
            filterOptions.endDate = undefined;
          } else if (filterItem.operator === 'isNotEmpty') {
            filterOptions.endDateOperator = FilterOperator.NOT_EQUAL;
            filterOptions.endDate = undefined;
          } else if (filterItem.value != null) {
            filterOptions.endDate =
              filterItem.value instanceof Date ? filterItem.value : new Date(filterItem.value);
            filterOptions.endDateOperator = convertDateFilterOperator(filterItem.operator);
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

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      const sortOptions = convertSortModelToDomain(sortModel);
      const userFilterOptions = convertFilterModelToDomain(filterModel);
      const baseFilterOptions: CompetitionInstanceFilterOptions = {
        ...(competitionId ? { competitionId } : {}),
        ...userFilterOptions,
      };

      try {
        const result = await getCompetitionInstances.execute(
          ['competition', 'organizer_type'],
          Object.keys(baseFilterOptions).length > 0 ? baseFilterOptions : undefined,
          sortOptions,
          { perPage: paginationModel.pageSize, cursor },
        );

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
  }, [paginationModel, sortModel, filterModel, cursor, getCompetitionInstances, competitionId]);

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

  const handleRowClick = (params: GridRowParams) => {
    router.push(`/competitions/${competitionId}/instances/${params.row.id}`);
  };

  const handleDeleteClick = (competitionInstanceId: string, competitionInstanceName?: string) => {
    setSelectedCompetitionInstanceId(competitionInstanceId);
    setSelectedCompetitionInstanceName(competitionInstanceName || null);
    setOpenDeleteDialog(true);
  };

  const handleDeleteAccept = async () => {
    if (!selectedCompetitionInstanceId) {
      console.error('No competition instance selected for deletion');

      return;
    }

    const result = await deleteCompetitionInstance.execute(selectedCompetitionInstanceId);
    match(result, {
      onRight: () => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedCompetitionInstanceId));
      },
      onLeft: (error) => {
        console.error('Failed to delete competition instance:', error);
      },
    });

    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedCompetitionInstanceId(null);
      setSelectedCompetitionInstanceName(null);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedCompetitionInstanceId(null);
      setSelectedCompetitionInstanceName(null);
    }, 1000);
  };

  return (
    <>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedCompetitionInstanceName || 'this instance'}? This action cannot be undone.`}
        acceptText="Delete"
        cancelText="Cancel"
      />
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
                field: 'shortname',
                headerName: 'Shortname',
                flex: 1,
                minWidth: 120,
                filterable: true,
                sortable: true,
                filterOperators: [StringOperators.contains],
              },
              {
                field: 'organizer',
                headerName: 'Organizer',
                flex: 2,
                minWidth: 200,
                filterable: true,
                sortable: true,
                filterOperators: [StringOperators.contains],
              },
              {
                field: 'organizerType',
                headerName: 'Organizer Type',
                flex: 1,
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
                    InputComponent: CompetitionOrganizerTypeFilterInput,
                  },
                ],
              },
              {
                field: 'location',
                headerName: 'Location',
                flex: 2,
                minWidth: 200,
                filterable: true,
                sortable: true,
                filterOperators: [StringOperators.contains],
              },
              {
                field: 'startDate',
                type: 'date',
                headerName: 'Start Date',
                flex: 1,
                minWidth: 100,
                filterable: true,
                sortable: true,
                filterOperators: [
                  DateOperators.is,
                  DateOperators.not,
                  DateOperators.after,
                  DateOperators.onOrAfter,
                  DateOperators.before,
                  DateOperators.onOrBefore,
                  DateOperators.isEmpty,
                  DateOperators.isNotEmpty,
                ],
              },
              {
                field: 'endDate',
                type: 'date',
                headerName: 'End Date',
                flex: 1,
                minWidth: 100,
                filterable: true,
                sortable: true,
                filterOperators: [
                  DateOperators.is,
                  DateOperators.not,
                  DateOperators.after,
                  DateOperators.onOrAfter,
                  DateOperators.before,
                  DateOperators.onOrBefore,
                  DateOperators.isEmpty,
                  DateOperators.isNotEmpty,
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
                      // @ts-expect-error Link component requires href prop but it does not exposed as a prop for some reason. Read more on https://github.com/mui/mui-x/issues/9913
                      href={`/competitions/${competitionId}/instances/${params.row.actions.id}`}
                    />
                    {['update-competition'].some((p) => userPermissions.has(p)) ? (
                      <GridActionsCellItem
                        key="edit"
                        showInMenu
                        icon={<EditRounded />}
                        label="Edit"
                        component={Link}
                        // @ts-expect-error Link component requires href prop but it does not exposed as a prop for some reason. Read more on https://github.com/mui/mui-x/issues/9913
                        href={`/competitions/${competitionId}/instances/${params.row.actions.id}/edit`}
                      />
                    ) : null}
                    {['delete-competition'].some((p) => userPermissions.has(p)) ? (
                      <GridActionsCellItem
                        key="delete"
                        showInMenu
                        icon={<DeleteRounded />}
                        label="Delete"
                        onClick={() =>
                          handleDeleteClick(params.row.actions.id, params.row.actions.name)
                        }
                      />
                    ) : null}
                  </GridActionsCell>
                ),
              },
            ]}
            rows={rows.map((instance) => ({
              id: instance.id,
              name: instance.name,
              shortname: instance.shortname,
              organizer: instance.organizer,
              organizerType: instance.organizerType?.name || 'N/A',
              location: instance.location,
              startDate: instance.startDate,
              endDate: instance.endDate,
              actions: instance,
            }))}
            slots={{
              noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
            }}
            slotProps={{
              noRowsOverlay: { text: 'No competition instances found.' },
              loadingOverlay: {
                variant: 'skeleton',
                noRowsVariant: 'skeleton',
              },
            }}
            pageSizeOptions={[25, 50, 100]}
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
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
