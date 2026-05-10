'use client';

import Link from 'next/link';
import { AlertDialog, EmptyRowOverlay } from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  CompetitionInstance,
  CompetitionInstanceFilterOptions,
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
  GridPaginationMeta,
  GridPaginationModel,
  GridRowParams,
  GridSlots,
} from '@mui/x-data-grid';
import { DeleteCompetitionInstance, GetCompetitionInstances } from '@app/application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useInternalStore } from '@app/presentation/hooks';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const [selectedCompetitionInstanceId, setSelectedCompetitionInstanceId] = useState<string | null>(
    null,
  );
  const [selectedCompetitionInstanceName, setSelectedCompetitionInstanceName] = useState<
    string | null
  >(null);

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
      const filterOptions: CompetitionInstanceFilterOptions | undefined = competitionId
        ? { competitionId }
        : undefined;
      const result = await getCompetitionInstances.execute(undefined, filterOptions, {
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
              { field: 'id', headerName: 'ID', flex: 1 },
              { field: 'name', headerName: 'Name', flex: 2 },
              { field: 'shortname', headerName: 'Shortname', flex: 1 },
              { field: 'organizer', headerName: 'Organizer', flex: 2 },
              { field: 'location', headerName: 'Location', flex: 2 },
              { field: 'startDate', headerName: 'Start Date', flex: 1 },
              { field: 'endDate', headerName: 'End Date', flex: 1 },
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
              location: instance.location,
              startDate: instance.startDate.toLocaleDateString(),
              endDate: instance.endDate.toLocaleDateString(),
              actions: instance,
            }))}
            slots={{
              noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'],
            }}
            slotProps={{
              noRowsOverlay: { text: 'No competition instances found.' },
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
