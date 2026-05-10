'use client';

import Link from 'next/link';
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
import { DeleteFundApplication, GetFundApplications } from '@app/application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { FundApplication, PaginationOptions } from '@app/domain/entities';
import {
  FundApplicationDto,
  FundApplicationMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useInternalStore } from '@app/presentation/hooks';
import { useMemo, useState } from 'react';
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
  const [selectedFundApplicationId, setSelectedFundApplicationId] = useState<string | null>(null);
  const [selectedFundApplicationName, setSelectedFundApplicationName] = useState<string | null>(
    null,
  );

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
      const result = await getFundApplications.execute(['team', 'team.members'], undefined, {
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
                field: 'letterOfAcceptance',
                headerName: 'LoA',
                flex: 0.5,
              },
              {
                field: 'proposal',
                headerName: 'Proposal',
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
                      href={`/fund-applications/${params.row.actions.id}`}
                    />
                    {['update-fund-application'].some((p) => userPermissions.has(p)) ||
                    (['update-own-fund-application'].some((p) => userPermissions.has(p)) &&
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
                        href={`/fund-applications/${params.row.actions.id}/edit`}
                      />
                    ) : null}
                    {['delete-fund-application'].some((p) => userPermissions.has(p)) ||
                    (['delete-own-fund-application'].some((p) => userPermissions.has(p)) &&
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
