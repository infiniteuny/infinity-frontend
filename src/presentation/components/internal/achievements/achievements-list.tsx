'use client';

import Link from 'next/link';
import { Achievement, PaginationOptions, User } from '@app/domain/entities';
import {
  AchievementDto,
  AchievementMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import {
  AlertDialog,
  CompetitionInstanceFilterInput,
  CompetitionOutputFilterInput,
  CompetitionRankFilterInput,
  CompetitionScaleFilterInput,
  CompetitionTimeRangeFilterInput,
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
import { DeleteAchievement, GetAchievements } from '@app/application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { AchievementFilterOptions, AchievementSortOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useInternalStore } from '@app/presentation/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const deleteAchievement = useMemo(
    () => clientContainer.get<DeleteAchievement>(SYMBOLS.DeleteAchievement),
    [],
  );
  const initAchievements = initialAchievements.map(AchievementMapper.fromDtoToDomain);
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = new Set(userSession?.permissions || []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<Achievement[]>(initAchievements);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initAchievements.length,
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
  const lastFetchedStateRef = useRef<string>(JSON.stringify({ filters: [], sort: [] }));

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedAchievementId, setSelectedAchievementId] = useState<string | null>(null);
  const [selectedAchievementName, setSelectedAchievementName] = useState<string | null>(null);

  const convertSortModelToDomain = (model: GridSortModel): AchievementSortOptions | undefined => {
    if (model.length === 0) return undefined;

    const fieldMap: Record<string, keyof AchievementSortOptions> = {
      competitionBranch: 'competitionBranch',
      status: 'status',
    };

    const sortOptions: AchievementSortOptions = {};
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
  ): AchievementFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;

    const filterOptions: AchievementFilterOptions = {};

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
        case 'competitionTimeRange':
          if (filterItem.value != null) {
            filterOptions.competitionTimeRangeId = String(filterItem.value);
          }
          break;
        case 'competitionOutput':
          if (filterItem.value != null) {
            filterOptions.competitionOutputId = String(filterItem.value);
          }
          break;
        case 'competitionRank':
          if (filterItem.value != null) {
            filterOptions.competitionRankId = String(filterItem.value);
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

    const stateString = JSON.stringify({
      filters: filterModel.items
        .filter((item) => item.value != null && item.value !== '')
        .map((item) => ({ field: item.field, value: item.value })),
      sort: sortModel,
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
        const result = await getAchievements.execute(
          [
            'team',
            'team.members',
            'competition_instance',
            'competition_scale',
            'competition_time_range',
            'competition_output',
            'competition_rank',
          ],
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
  }, [paginationModel, sortModel, filterModel, cursor, getAchievements]);

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
    router.push(`/achievements/${params.row.id}`);
  };

  const handleDeleteClick = (achievementId: string, achievementName?: string) => {
    setSelectedAchievementId(achievementId);
    setSelectedAchievementName(achievementName || null);
    setOpenDeleteDialog(true);
  };

  const handleDeleteAccept = async () => {
    if (!selectedAchievementId) {
      console.error('No achievement selected for deletion');

      return;
    }

    const result = await deleteAchievement.execute(selectedAchievementId);
    match(result, {
      onRight: () => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== selectedAchievementId));
      },
      onLeft: (error) => {
        console.error('Failed to delete achievement:', error);
      },
    });

    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedAchievementId(null);
      setSelectedAchievementName(null);
    }, 1000);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setTimeout(function () {
      setSelectedAchievementId(null);
      setSelectedAchievementName(null);
    }, 1000);
  };

  return (
    <>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedAchievementName || 'this achievement'}? This action cannot be undone.`}
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
                field: 'competitionTimeRange',
                headerName: 'Time Range',
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
                    InputComponent: CompetitionTimeRangeFilterInput,
                  },
                ],
              },
              {
                field: 'competitionOutput',
                headerName: 'Output',
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
                    InputComponent: CompetitionOutputFilterInput,
                  },
                ],
              },
              {
                field: 'competitionRank',
                headerName: 'Rank',
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
                    InputComponent: CompetitionRankFilterInput,
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
                field: 'image',
                headerName: 'Image',
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
                      href={`/achievements/${params.row.actions.id}`}
                    />
                    {['update-achievements'].some((p) => userPermissions.has(p)) ||
                    (['update-own-achievements'].some((p) => userPermissions.has(p)) &&
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
                        href={`/achievements/${params.row.actions.id}/edit`}
                      />
                    ) : null}
                    {['delete-achievements'].some((p) => userPermissions.has(p)) ||
                    (['delete-own-achievements'].some((p) => userPermissions.has(p)) &&
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
              actions: achievement,
            }))}
            slots={{
              noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
            }}
            slotProps={{
              noRowsOverlay: { text: 'No achievements found.' },
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
