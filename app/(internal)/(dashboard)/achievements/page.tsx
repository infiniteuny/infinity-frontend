import { GetAchievements, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import {
  AchievementDto,
  AchievementMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  AchievementsList,
  AchievementsToolbar,
} from '@app/presentation/components/internal/achievements';

export const dynamic = 'force-dynamic';

export default async function AchievementsPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (!['read-achievement', 'read-own-achievement'].some((p) => userPermissions.has(p))) {
    notFound();
  } else {
    const getAchievements = serverContainer.get<GetAchievements>(SYMBOLS.GetAchievements);
    const result = await getAchievements.execute(
      [
        'team',
        'competition_instance',
        'competition_scale',
        'competition_time_range',
        'competition_output',
        'competition_rank',
      ],
      undefined,
      { perPage: 25 },
    );
    const [achievements, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title="Achievements">
          <AchievementsToolbar />
        </SectionHeader>
        <AchievementsList
          initialAchievements={
            achievements.map(AchievementMapper.fromDomainToDto) as AchievementDto[]
          }
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </>
    );
  }
}
