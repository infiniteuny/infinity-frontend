'use client';

import Link from 'next/link';
import {
  AlertDialog,
  CompetitionInstanceFilterInput,
  CompetitionScaleFilterInput,
  EmptyRowOverlay,
  StringOperators,
  TeamFilterInput,
} from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
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
import { DeleteFundApplication, GetFundApplications } from '@app/application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import {
  FundApplication,
  FundApplicationFilterOptions,
  FundApplicationSortOptions,
  PaginationOptions,
  User,
} from '@app/domain/entities';
import {
  FundApplicationDto,
  FundApplicationMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useInternalStore } from '@app/presentation/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const deleteFundApplication = useMemo(
    () => clientContainer.get<DeleteFundApplication>(SYMBOLS.DeleteFundApplication),
    [],
  );
  const initFundApplications = initialFundApplications.map(FundApplicationMapper.fromDtoToDomain);
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = new Set(userSession?.permissions || []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<FundApplication[]>(initFundApplications);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initFundApplications.length,
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
  const [selectedFundApplicationId, setSelectedFundApplicationId] = useState<string | null>(null);
  const [selectedFundApplicationName, setSelectedFundApplicationName] = useState<string | null>(
    null,
  );

  const convertSortModelToDomain = (
    model: GridSortModel,
  ): FundApplicationSortOptions | undefined => {
    if (model.length === 0) return undefined;

    const fieldMap: Record<string, keyof FundApplicationSortOptions> = {
      competitionBranch: 'competitionBranch',
      status: 'status',
    };

    const sortOptions: FundApplicationSortOptions = {};
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
  ): FundApplicationFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;

    const filterOptions: FundApplicationFilterOptions = {};

    for (const filterItem of model.items) {
      switch (filterItem.field) {
        case 'team':
          if (filterItem.value != null) {
            filterOptions.teamId = String(filterItem.value);
          }
          break;
        case 'competition':
          if (filterItem.value != null) {
            filterOptions.competitionInstanceId = String(filterItem.value);
          }
          break;
        case 'competitionScale':
          if (filterItem.value != null) {
            filterOptions.competitionScaleId = String(filterItem.value);
          }
          break;
        case 'competitionBranch':
          if (filterItem.value != null) {
            filterOptions.competitionBranch = String(filterItem.value);
          }
          break;
        case 'status':
          if (filterItem.value != null) {
            filterOptions.status = String(filterItem.value) as 'PENDING' | 'REJECTED' | 'ACCEPTED';
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
      const filterOptions = convertFilterModelToDomain(filterModel);

      try {
        const result = await getFundApplications.execute(
          ['team', 'team.members', 'competition_instance', 'competition_scale'],
          filterOptions,
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
  }, [paginationModel, sortModel, filterModel, cursor, getFundApplications]);

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

  const handleDeleteClick = (fundApplicationId: string, fundApplicationName?: string) => {
    setSelectedFundApplicationId(fundApplicationId);
    setSelectedFundApplicationName(fundApplicationName || null);
    setOpenDeleteDialog(true);
  };

  const handleDeleteAccept = async () => {
    if (!selectedFundApplicationId) {
      console.error('No fund application selected for deletion');

      return;
    }

    const result = await deleteFundApplication.execute(selectedFundApplicationId);
    match(result, {
      onRight: () => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedFundApplicationId));
      },
      onLeft: (error) => {
        console.error('Failed to delete fund application:', error);
      },
    });

    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedFundApplicationId(null);
      setSelectedFundApplicationName(null);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedFundApplicationId(null);
      setSelectedFundApplicationName(null);
    }, 1000);
  };

  const handleRowClick = (params: GridRowParams) => {
    router.push(`/fund-applications/${params.row.id}`);
  };

  return (
    <>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedFundApplicationName || 'this fund application'}? This action cannot be undone.`}
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
                field: 'team',
                headerName: 'Team',
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
                    InputComponent: TeamFilterInput,
                  },
                ],
              },
              {
                field: 'competition',
                headerName: 'Competition',
                flex: 2,
                minWidth: 200,
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
                    InputComponent: CompetitionInstanceFilterInput,
                  },
                ],
              },
              {
                field: 'competitionScale',
                headerName: 'Scale',
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
                    InputComponent: CompetitionScaleFilterInput,
                  },
                ],
              },
              {
                field: 'competitionBranch',
                headerName: 'Branch',
                flex: 2,
                minWidth: 200,
                filterable: true,
                sortable: true,
                filterOperators: [StringOperators.contains],
              },
              {
                field: 'competitionStartDate',
                headerName: 'Start Date',
                flex: 1,
                minWidth: 100,
                filterable: false,
                sortable: false,
              },
              {
                field: 'competitionEndDate',
                headerName: 'End Date',
                flex: 1,
                minWidth: 100,
                filterable: false,
                sortable: false,
              },
              {
                field: 'letterOfAcceptance',
                headerName: 'LoA',
                flex: 0.5,
                minWidth: 100,
                filterable: false,
                sortable: false,
              },
              {
                field: 'proposal',
                headerName: 'Proposal',
                flex: 0.5,
                minWidth: 100,
                filterable: false,
                sortable: false,
              },
              {
                field: 'status',
                headerName: 'Status',
                flex: 1,
                minWidth: 120,
                filterable: true,
                sortable: true,
                filterOperators: [StringOperators.equals],
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
                      href={`/fund-applications/${params.row.actions.id}`}
                    />
                    {['update-fund-application'].some((p) => userPermissions.has(p)) ||
                    (['update-own-fund-application'].some((p) => userPermissions.has(p)) &&
                      params.row.actions.team?.members?.some(
                        (member: User) => member.id === userSession?.user?.id,
                      )) ? (
                      <GridActionsCellItem
                        key="edit"
                        showInMenu
                        icon={<EditRounded />}
                        label="Edit"
                        component={Link}
                        // @ts-expect-error Link component requires href prop but it does not exposed as a prop for some reason. Read more on https://github.com/mui/mui-x/issues/9913
                        href={`/fund-applications/${params.row.actions.id}/edit`}
                      />
                    ) : null}
                    {['delete-fund-application'].some((p) => userPermissions.has(p)) ||
                    (['delete-own-fund-application'].some((p) => userPermissions.has(p)) &&
                      params.row.actions.team?.members?.some(
                        (member: User) => member.id === userSession?.user?.id,
                      )) ? (
                      <GridActionsCellItem
                        key="delete"
                        showInMenu
                        icon={<DeleteRounded />}
                        label="Delete"
                        onClick={() =>
                          handleDeleteClick(params.row.actions.id, params.row.actions.team?.name)
                        }
                      />
                    ) : null}
                  </GridActionsCell>
                ),
              },
            ]}
            rows={rows.map((fundApplication) => ({
              id: fundApplication.id,
              team: fundApplication.team?.name || 'N/A',
              competition: fundApplication.competitionInstance?.name || 'N/A',
              competitionScale: fundApplication.competitionScale?.name || 'N/A',
              competitionBranch: fundApplication.competitionBranch,
              competitionStartDate: fundApplication.competitionStartDate.toLocaleDateString(),
              competitionEndDate: fundApplication.competitionEndDate.toLocaleDateString(),
              letterOfAcceptance: fundApplication.letterOfAcceptance,
              proposal: fundApplication.proposal,
              status: fundApplication.status,
              actions: fundApplication,
            }))}
            slots={{
              noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
            }}
            slotProps={{
              noRowsOverlay: { text: 'No fund applications found.' },
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
