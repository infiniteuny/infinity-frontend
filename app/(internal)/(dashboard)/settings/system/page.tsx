import { GetConfigs, GetSession } from '@app/application';
import { ConfigDto, ConfigMapper } from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SystemSettingsView } from '@app/presentation/components/internal/system-settings';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';

export default async function SystemSettingsPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['create-config', 'update-config'].some((p) => userPermissions.has(p))) {
    const getConfigs = serverContainer.get<GetConfigs>(SYMBOLS.GetConfigs);

    const result = await getConfigs.execute(undefined, { perPage: 100 });
    const [configs] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title="System Settings" />
        <SystemSettingsView configs={configs.map(ConfigMapper.fromDomainToDto) as ConfigDto[]} />
      </>
    );
  } else {
    notFound();
  }
}
