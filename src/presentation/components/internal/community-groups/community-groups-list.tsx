'use client';

import Link from 'next/link';
import {
  AlertDialog,
  BooleanOperators,
  EmptyRowOverlay,
  StringOperators,
} from '@app/presentation/components/internal/shared';
import { Box, NoSsr } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  CommunityGroup,
  CommunityGroupFilterOptions,
  CommunityGroupSortOptions,
  PaginationOptions,
} from '@app/domain/entities';
import {
  CommunityGroupDto,
  CommunityGroupMapper,
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
import { DeleteCommunityGroup, GetCommunityGroups } from '@app/application';
import { DeleteRounded, EditRounded, VisibilityRounded } from '@mui/icons-material';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useInternalStore } from '@app/presentation/hooks';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  initialCommunityGroups: CommunityGroupDto[];
  initialPaginationOptions: PaginationOptionsDto;
};

export function CommunityGroupsList({ initialCommunityGroups, initialPaginationOptions }: Props) {
  const getCommunityGroups = useMemo(
    () => clientContainer.get<GetCommunityGroups>(SYMBOLS.GetCommunityGroups),
    [],
  );
  const deleteCommunityGroup = useMemo(
    () => clientContainer.get<DeleteCommunityGroup>(SYMBOLS.DeleteCommunityGroup),
    [],
  );
  const initCommunityGroups = initialCommunityGroups.map(CommunityGroupMapper.fromDtoToDomain);
  const initPaginationOptions = PaginationOptionsMapper.fromDtoToDomain(initialPaginationOptions);
  const router = useRouter();
  const userSession = useInternalStore((s) => s.session);
  const userPermissions = new Set(userSession?.permissions || []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<CommunityGroup[]>(initCommunityGroups);
  const [rowCount, setRowCount] = useState<number>(
    initPaginationOptions.nextCursor ? -1 : initCommunityGroups.length,
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
  const lastFetchedStateRef = useRef<string>('[]');
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedCommunityGroupId, setSelectedCommunityGroupId] = useState<string | null>(null);
  const [selectedCommunityGroupName, setSelectedCommunityGroupName] = useState<string | null>(null);

  const convertSortModelToDomain = (
    model: GridSortModel,
  ): CommunityGroupSortOptions | undefined => {
    if (model.length === 0) return undefined;
    const fieldMap: Record<string, keyof CommunityGroupSortOptions> = {
      id: 'id',
      name: 'name',
      priority: 'priority',
      isActive: 'isActive',
    };
    const sortOptions: CommunityGroupSortOptions = {};
    for (const sortItem of model) {
      const d = fieldMap[sortItem.field];
      if (d) sortOptions[d] = sortItem.sort === 'asc' ? 'ASC' : 'DESC';
    }
    return Object.keys(sortOptions).length > 0 ? sortOptions : undefined;
  };

  const convertFilterModelToDomain = (
    model: GridFilterModel,
  ): CommunityGroupFilterOptions | undefined => {
    if (model.items.length === 0) return undefined;
    const f: CommunityGroupFilterOptions = {};
    for (const i of model.items) {
      if (i.field === 'name' && i.value != null) f.name = String(i.value);
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
        const result = await getCommunityGroups.execute(
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
  }, [paginationModel, sortModel, filterModel, cursor, getCommunityGroups]);

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
    router.push(`/community-groups/${p.row.id}`);
  };
  const handleDeleteClick = (id: string, name?: string) => {
    setSelectedCommunityGroupId(id);
    setSelectedCommunityGroupName(name || null);
    setOpenDeleteDialog(true);
  };
  const handleDeleteAccept = async () => {
    if (!selectedCommunityGroupId) return;
    const r = await deleteCommunityGroup.execute(selectedCommunityGroupId);
    match(r, {
      onRight: () => {
        setRows((p) => p.filter((x) => x.id !== selectedCommunityGroupId));
      },
      onLeft: (e) => {
        console.error('Failed to delete community group:', e);
      },
    });
    setOpenDeleteDialog(false);
    setTimeout(() => {
      setSelectedCommunityGroupId(null);
      setSelectedCommunityGroupName(null);
    }, 1000);
  };
  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setTimeout(() => {
      setSelectedCommunityGroupId(null);
      setSelectedCommunityGroupName(null);
    }, 1000);
  };

  return (
    <>
      <AlertDialog
        open={openDeleteDialog}
        onAccept={handleDeleteAccept}
        onCancel={handleDeleteCancel}
        title="Permanently delete?"
        description={`Are you sure you want to permanently delete ${selectedCommunityGroupName || 'this community group'}? This action cannot be undone.`}
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
                flex: 1.5,
                minWidth: 200,
                filterable: true,
                sortable: true,
                filterOperators: [StringOperators.contains],
              },
              {
                field: 'priority',
                headerName: 'Priority',
                flex: 1,
                minWidth: 100,
                filterable: false,
                sortable: false,
              },
              {
                field: 'isActive',
                headerName: 'Active',
                type: 'boolean',
                flex: 0.75,
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
                      href={`/community-groups/${p.row.actions.id}`}
                    />
                    {['update-community-group'].some((x) => userPermissions.has(x)) ? (
                      <GridActionsCellItem
                        key="edit"
                        showInMenu
                        icon={<EditRounded />}
                        label="Edit"
                        component={Link}
                        // @ts-expect-error Link component requires href prop but it does not exposed as a prop for some reason. Read more on https://github.com/mui/mui-x/issues/9913
                        href={`/community-groups/${p.row.actions.id}/edit`}
                      />
                    ) : null}
                    {['delete-community-group'].some((x) => userPermissions.has(x)) ? (
                      <GridActionsCellItem
                        key="delete"
                        showInMenu
                        icon={<DeleteRounded />}
                        label="Delete"
                        onClick={() => handleDeleteClick(p.row.actions.id, p.row.actions.name)}
                      />
                    ) : null}
                  </GridActionsCell>
                ),
              },
            ]}
            rows={rows.map((x) => ({
              id: x.id,
              name: x.name,
              priority: x.priority,
              isActive: x.isActive,
              actions: x,
            }))}
            slots={{ noRowsOverlay: EmptyRowOverlay as GridSlots['noRowsOverlay'] }}
            slotProps={{
              noRowsOverlay: { text: 'No community groups found.' },
              loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' },
            }}
            pageSizeOptions={[25, 50, 100]}
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            initialState={{ columns: { columnVisibilityModel: { id: false } } }}
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
