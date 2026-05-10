'use client';

import Link from 'next/link';
import { Achievement, PaginationOptions } from '@app/domain/entities';
import {
  AchievementDto,
  AchievementMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { AlertDialog, EmptyRowOverlay } from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  DataGrid,
  GridActionsCell,
  GridActionsCellItem,
  GridPaginationMeta,
  GridPaginationModel,
  GridRowParams,
  GridSlots,
} from '@mui/x-data-grid';
import { DeleteAchievement, GetAchievements } from '@app/application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useInternalStore } from '@app/presentation/hooks';
import { useMemo, useState } from 'react';
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

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedAchievementId, setSelectedAchievementId] = useState<string | null>(null);
  const [selectedAchievementName, setSelectedAchievementName] = useState<string | null>(null);

  const handlePaginationModelChange = async (newPaginationModel: GridPaginationModel) => {
    const isPageSizeChanged = newPaginationModel.pageSize !== paginationModel.pageSize;
    const normalizedPaginationModel = isPageSizeChanged
      ? { ...newPaginationModel, page: 0 }
      : newPaginationModel;

    setIsLoading(true);

    let cursor: string | undefined;
    if (isPageSizeChanged) {
      cursor = undefined;
    } else if (
      normalizedPaginationModel.page > paginationModel.page &&
      paginationOptions.nextCursor
    ) {
      cursor = paginationOptions.nextCursor;
    } else if (
      normalizedPaginationModel.page < paginationModel.page &&
      paginationOptions.previousCursor
    ) {
      cursor = paginationOptions.previousCursor;
    } else {
      cursor = paginationOptions.cursor;
    }

    try {
      const result = await getAchievements.execute(undefined, undefined, {
        perPage: normalizedPaginationModel.pageSize,
        cursor,
      });

      match(result, {
        onRight: ([newRows, nextPaginationOptions]) => {
          const hasNextPage = Boolean(nextPaginationOptions.nextCursor);

          let page;
          if (normalizedPaginationModel.page === 0 && nextPaginationOptions.previousCursor) {
            page = 1;
          } else if (
            normalizedPaginationModel.page < paginationModel.page &&
            !nextPaginationOptions.previousCursor
          ) {
            page = 0;
          } else {
            page = normalizedPaginationModel.page;
          }

          setRows(newRows);
          setRowCount(
            hasNextPage ? -1 : page * normalizedPaginationModel.pageSize + newRows.length,
          );
          setPaginationMeta({ hasNextPage });
          setPaginationModel({ page, pageSize: normalizedPaginationModel.pageSize });
          setPaginationOptions(nextPaginationOptions);
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
                field: 'competitionTimeRange',
                headerName: 'Time Range',
                flex: 1,
              },
              {
                field: 'competitionOutput',
                headerName: 'Output',
                flex: 1,
              },
              {
                field: 'competitionRank',
                headerName: 'Rank',
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
                field: 'image',
                headerName: 'Image',
                flex: 0.5,
              },
              {
                field: 'status',
                headerName: 'Status',
                flex: 1,
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
                        (member) => member.id === userSession?.user?.id,
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
                        (member) => member.id === userSession?.user?.id,
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
            onPaginationModelChange={handlePaginationModelChange}
            onRowClick={handleRowClick}
            disableRowSelectionOnClick
          />
        </NoSsr>
      </Box>
    </>
  );
}
