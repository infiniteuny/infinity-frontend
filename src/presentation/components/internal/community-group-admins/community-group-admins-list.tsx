'use client';

import Link from 'next/link';
import {
  AlertDialog,
  BooleanOperators,
  EmptyRowOverlay,
  SectionHeader,
} from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  CommunityGroupAdmin,
  CommunityGroupAdminFilterOptions,
  CommunityGroupAdminSortOptions,
  PaginationOptions,
} from '@app/domain/entities';
import {
  CommunityGroupAdminDto,
  CommunityGroupAdminMapper,
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
  useGridApiRef,
} from '@mui/x-data-grid';
import { DeleteCommunityGroupAdmin, GetCommunityGroupAdmins } from '@app/application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useInternalStore } from '@app/presentation/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CommunityGroupAdminsToolbar } from './community-group-admins-toolbar';

type Props = {
  initialCommunityGroupAdmins: CommunityGroupAdminDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function CommunityGroupAdminsList({
  initialCommunityGroupAdmins,
  initialPaginationOptions,
}: Props) {
  const getCommunityGroupAdmins = useMemo(
    () => clientContainer.get<GetCommunityGroupAdmins>(SYMBOLS.GetCommunityGroupAdmins),
    [],
  );
  const deleteCommunityGroupAdmin = useMemo(
    () => clientContainer.get<DeleteCommunityGroupAdmin>(SYMBOLS.DeleteCommunityGroupAdmin),
    [],
  );
  const initCommunityGroupAdmins = initialCommunityGroupAdmins.map(
    CommunityGroupAdminMapper.fromDtoToDomain,
  );
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = new Set(userSession?.permissions || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<CommunityGroupAdmin[]>(initCommunityGroupAdmins);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initCommunityGroupAdmins.length,
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
  const dataGridApiRef = useGridApiRef();
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedCommunityGroupAdminId, setSelectedCommunityGroupAdminId] = useState<string | null>(
    null,
  );
  const [selectedCommunityGroupAdminYear, setSelectedCommunityGroupAdminYear] = useState<
    string | null
  >(null);

  const convertSortModelToDomain = (
    model: GridSortModel,
  ): CommunityGroupAdminSortOptions | undefined => {
    if (model.length === 0) return undefined;
    const fieldMap: Record<string, keyof CommunityGroupAdminSortOptions> = {
      id: 'id',
      year: 'year',
      isActive: 'isActive',
    };
    const sortOptions: CommunityGroupAdminSortOptions = {};
    for (const sortItem of model) {
      const d = fieldMap[sortItem.field];
      if (d) sortOptions[d] = sortItem.sort === 'asc' ? 'ASC' : 'DESC';
    }
    return Object.keys(sortOptions).length > 0 ? sortOptions : undefined;
  };

  const convertFilterModelToDomain = (
    model: GridFilterModel,
  ): CommunityGroupAdminFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;
    const f: CommunityGroupAdminFilterOptions = {};
    for (const i of model.items) {
      if (i.field === 'isActive' && i.value != null) f.isActive = Boolean(i.value);
    }
    return Object.keys(f).length > 0 ? f : undefined;
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
      try {
        const result = await getCommunityGroupAdmins.execute(
          convertFilterModelToDomain(filterModel),
          convertSortModelToDomain(sortModel),
          { perPage: paginationModel.pageSize, cursor },
        );
        if (cancelled) return;
        match(result, {
          onRight: ([newRows, next]) => {
            const h = Boolean(next.nextCursor);
            setRows(newRows);
            setRowCount(h ? -1 : paginationModel.page * paginationModel.pageSize + newRows.length);
            setPaginationMeta({ hasNextPage: h });
            setPaginationOptions(next);
          },
          onLeft: (e) => {
            throw e;
          },
        });
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [paginationModel, sortModel, filterModel, cursor, getCommunityGroupAdmins]);

  const handlePaginationModelChange = useCallback(
    (m: GridPaginationModel) => {
      const sz = m.pageSize !== paginationModel.pageSize;
      const n = sz ? { ...m, page: 0 } : m;
      let c: string | undefined;
      if (sz) c = undefined;
      else if (n.page > paginationModel.page && paginationOptions.nextCursor)
        c = paginationOptions.nextCursor;
      else if (n.page < paginationModel.page && paginationOptions.previousCursor)
        c = paginationOptions.previousCursor;
      else c = paginationOptions.cursor;
      setCursor(c);
      setPaginationModel(n);
    },
    [paginationModel, paginationOptions],
  );
  const handleSortModelChange = useCallback((m: GridSortModel) => {
    setCursor(undefined);
    setPaginationModel((p) => ({ page: 0, pageSize: p.pageSize }));
    setSortModel(m);
  }, []);
  const handleFilterModelChange = useCallback((m: GridFilterModel) => {
    setCursor(undefined);
    setPaginationModel((p) => ({ page: 0, pageSize: p.pageSize }));
    setFilterModel(m);
  }, []);
  const handleRowClick = (p: GridRowParams) => {
    router.push(`/community-group-admins/${p.row.id}`);
  };
  const handleDeleteClick = (id: string, year?: string) => {
    setSelectedCommunityGroupAdminId(id);
    setSelectedCommunityGroupAdminYear(year || null);
    setOpenDeleteDialog(true);
  };
  const handleDeleteAccept = async () => {
    if (!selectedCommunityGroupAdminId) return;
    const r = await deleteCommunityGroupAdmin.execute(selectedCommunityGroupAdminId);
    match(r, {
      onRight: () => {
        setRows((p) => p.filter((x) => x.id !== selectedCommunityGroupAdminId));
      },
      onLeft: (e) => {
        console.error('Failed to delete community group administrator:', e);
      },
    });
    setOpenDeleteDialog(false);
    setTimeout(() => {
      setSelectedCommunityGroupAdminId(null);
      setSelectedCommunityGroupAdminYear(null);
    }, 1000);
  };
  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setTimeout(() => {
      setSelectedCommunityGroupAdminId(null);
      setSelectedCommunityGroupAdminYear(null);
    }, 1000);
  };

  return (
    <>
      <SectionHeader title="Community Group Admins">
        <CommunityGroupAdminsToolbar dataGridApiRef={dataGridApiRef} />
      </SectionHeader>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedCommunityGroupAdminYear || 'this community group administrator'}? This action cannot be undone.`}
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
                field: 'year',
                headerName: 'Year',
                flex: 1,
                minWidth: 100,
                filterable: false,
                sortable: false,
              },
              {
                field: 'isActive',
                headerName: 'Active',
                type: 'boolean',
                flex: 0.5,
                minWidth: 80,
                filterable: true,
                sortable: true,
                filterOperators: [BooleanOperators.is],
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
                      // @ts-expect-error Link component requires href prop but it does not exposed as a prop for some reason. Read more on https://github.com/mui/mui-x/issues/9913
                      href={`/community-group-admins/${p.row.actions.id}`}
                    />
                    {['update-community-group-admin'].some((x) => userPermissions.has(x)) ? (
                      <GridActionsCellItem
                        key="edit"
                        showInMenu
                        icon={<EditRounded />}
                        label="Edit"
                        component={Link}
                        // @ts-expect-error Link component requires href prop but it does not exposed as a prop for some reason. Read more on https://github.com/mui/mui-x/issues/9913
                        href={`/community-group-admins/${p.row.actions.id}/edit`}
                      />
                    ) : null}
                    {['delete-community-group-admin'].some((x) => userPermissions.has(x)) ? (
                      <GridActionsCellItem
                        key="delete"
                        showInMenu
                        icon={<DeleteRounded />}
                        label="Delete"
                        onClick={() => handleDeleteClick(p.row.actions.id, `${p.row.actions.year}`)}
                      />
                    ) : null}
                  </GridActionsCell>
                ),
              },
            ]}
            rows={rows.map((x) => ({ id: x.id, year: x.year, isActive: x.isActive, actions: x }))}
            slots={{ noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'] }}
            slotProps={{
              noRowsOverlay: { text: 'No community group administrators found.' },
              loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' },
            }}
            pageSizeOptions={[25, 50, 100]}
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            initialState={{ columns: { columnVisibilityModel: { id: false, group: false } } }}
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
