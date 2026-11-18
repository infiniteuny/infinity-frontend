'use client';

import { Box, Container } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import {
  CompetitionInstanceDto,
  CompetitionInstanceMapper,
} from '@infiniteuny/infinity-infrastructure';
import {
  CompetitionInstanceFilterOptions,
  CompetitionInstanceSortOptions,
  FilterOperator,
} from '@infiniteuny/infinity-domain';
import { CompetitionsFilter, CompetitionStatusFilter } from './competitions-filter';
import { CompetitionsGrid } from './competitions-grid';
import { CompetitionsHeader } from './competitions-header';
import { GetCompetitionInstances } from '@infiniteuny/infinity-application';
import { isRight } from 'effect/Either';
import { SYMBOLS } from '@config';
import { useEffect, useMemo, useRef, useState } from 'react';

const PAGE_SIZE = 10;

type Props = {
  initialInstances: CompetitionInstanceDto[];
  initialNextCursor?: string;
};

function getCurrentUtcDate(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

function parseUtcCalendarTime(iso: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (match) {
    return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }
  const date = new Date(iso);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function getInstanceState(
  instance: CompetitionInstanceDto,
  nowUtcTime: number,
): 'ONGOING' | 'UPCOMING' | 'PAST' {
  const start = parseUtcCalendarTime(instance.start_date);
  const end = parseUtcCalendarTime(instance.end_date);

  if (end < nowUtcTime) return 'PAST';
  if (start <= nowUtcTime && end >= nowUtcTime) return 'ONGOING';
  return 'UPCOMING';
}

function buildStatusFilterOptions(
  status: CompetitionStatusFilter,
  currentDate: Date,
): CompetitionInstanceFilterOptions | undefined {
  switch (status) {
    case 'ONGOING':
      return {
        startDateOperator: FilterOperator.LESS_THAN_OR_EQUAL,
        startDate: currentDate,
        endDateOperator: FilterOperator.GREATER_THAN_OR_EQUAL,
        endDate: currentDate,
      };
    case 'UPCOMING':
      return {
        startDateOperator: FilterOperator.GREATER_THAN,
        startDate: currentDate,
      };
    case 'PAST':
      return {
        endDateOperator: FilterOperator.LESS_THAN,
        endDate: currentDate,
      };
    case 'ALL':
    default:
      return undefined;
  }
}

function buildStatusSortOptions(status: CompetitionStatusFilter): CompetitionInstanceSortOptions {
  return status === 'ONGOING' || status === 'UPCOMING'
    ? { startDate: 'ASC' }
    : { startDate: 'DESC' };
}

export function CompetitionsView({ initialInstances, initialNextCursor }: Props) {
  const getCompetitionInstances = useMemo(
    () => clientContainer.get<GetCompetitionInstances>(SYMBOLS.GetCompetitionInstances),
    [],
  );

  const [instances, setInstances] = useState<CompetitionInstanceDto[]>(initialInstances);
  const [nextCursor, setNextCursor] = useState<string | undefined>(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CompetitionStatusFilter>('ALL');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const requestAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      requestAbortRef.current?.abort();
    };
  }, []);

  const todayUtcTime = useMemo(() => getCurrentUtcDate().getTime(), []);

  const filteredInstances = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return [...instances]
      .filter((item) => {
        const state = getInstanceState(item, todayUtcTime);
        if (statusFilter !== 'ALL' && state !== statusFilter) {
          return false;
        }

        if (!query) return true;
        return (
          item.name.toLowerCase().includes(query) ||
          (item.shortname ?? '').toLowerCase().includes(query) ||
          item.organizer.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const stateA = getInstanceState(a, todayUtcTime);
        const stateB = getInstanceState(b, todayUtcTime);

        const rankOrder: Record<'ONGOING' | 'UPCOMING' | 'PAST', number> = {
          ONGOING: 0,
          UPCOMING: 1,
          PAST: 2,
        };

        if (stateA !== stateB) {
          return rankOrder[stateA] - rankOrder[stateB];
        }

        const timeA = parseUtcCalendarTime(a.start_date);
        const timeB = parseUtcCalendarTime(b.start_date);

        // Ongoing and upcoming: nearest start date first; Past: most recent start date first
        return stateA === 'PAST' ? timeB - timeA : timeA - timeB;
      });
  }, [instances, searchQuery, statusFilter, todayUtcTime]);

  const visibleInstances = useMemo(
    () => filteredInstances.slice(0, visibleCount),
    [filteredInstances, visibleCount],
  );

  const hasMore = visibleCount < filteredInstances.length || Boolean(nextCursor);

  const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'ALL';

  const fetchCompetitionsByStatus = async (nextStatus: CompetitionStatusFilter) => {
    requestAbortRef.current?.abort();
    const abortController = new AbortController();
    requestAbortRef.current = abortController;

    setIsLoading(true);
    setIsLoadingMore(false);
    setVisibleCount(PAGE_SIZE);

    try {
      const currentDate = getCurrentUtcDate();
      const result = await getCompetitionInstances.execute(
        ['competition', 'organizer_type'],
        buildStatusFilterOptions(nextStatus, currentDate),
        buildStatusSortOptions(nextStatus),
        { perPage: PAGE_SIZE },
        abortController.signal,
        false,
      );

      if (abortController.signal.aborted) return;

      if (isRight(result)) {
        const [items, pagination] = result.right;
        const mapped = items.map(
          (item) => CompetitionInstanceMapper.fromDomainToDto(item) as CompetitionInstanceDto,
        );
        setInstances(mapped);
        setNextCursor(pagination.nextCursor);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  const handleSearchQueryChange = (value: string) => {
    setSearchQuery(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleStatusFilterChange = (nextStatus: CompetitionStatusFilter) => {
    setStatusFilter(nextStatus);
    void fetchCompetitionsByStatus(nextStatus);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setVisibleCount(PAGE_SIZE);
    if (statusFilter !== 'ALL') {
      setStatusFilter('ALL');
      void fetchCompetitionsByStatus('ALL');
    }
  };

  const handleLoadMore = async () => {
    if (isLoading || isLoadingMore) return;

    const targetCount = visibleCount + PAGE_SIZE;

    if (targetCount <= filteredInstances.length || !nextCursor) {
      setVisibleCount(targetCount);
      return;
    }

    requestAbortRef.current?.abort();
    const abortController = new AbortController();
    requestAbortRef.current = abortController;

    setIsLoadingMore(true);
    try {
      const currentDate = getCurrentUtcDate();
      const result = await getCompetitionInstances.execute(
        ['competition', 'organizer_type'],
        buildStatusFilterOptions(statusFilter, currentDate),
        buildStatusSortOptions(statusFilter),
        { perPage: PAGE_SIZE, cursor: nextCursor },
        abortController.signal,
        false,
      );

      if (abortController.signal.aborted) return;

      if (isRight(result)) {
        const [newItems, pagination] = result.right;
        const mapped = newItems.map(
          (item) => CompetitionInstanceMapper.fromDomainToDto(item) as CompetitionInstanceDto,
        );

        setInstances((prev) => {
          const existingIds = new Set(prev.map((i) => i.id));
          const uniqueNew = mapped.filter((i) => !existingIds.has(i.id));
          return [...prev, ...uniqueNew];
        });
        setNextCursor(pagination.nextCursor);
        setVisibleCount(targetCount);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoadingMore(false);
      }
    }
  };

  return (
    <Box className="flex min-h-[calc(100vh-9.625rem)] flex-col">
      <Box className="pt-12 pb-8 md:pt-16 md:pb-12">
        <Container maxWidth="lg">
          <CompetitionsHeader />
        </Container>
      </Box>

      <Box className="relative">
        <Box
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 -bottom-px bg-(--m3-palette-surfaceContainerLowest-main)"
        />
        <Container maxWidth="lg" className="relative z-10">
          <CompetitionsFilter
            searchQuery={searchQuery}
            onSearchQueryChange={handleSearchQueryChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
          />
        </Container>
      </Box>

      <Box className="flex-1 bg-(--m3-palette-surfaceContainerLowest-main) pt-10 pb-16 md:pt-12 md:pb-20">
        <Container maxWidth="lg">
          <CompetitionsGrid
            instances={visibleInstances}
            isLoading={isLoading}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={handleResetFilters}
          />
        </Container>
      </Box>
    </Box>
  );
}
