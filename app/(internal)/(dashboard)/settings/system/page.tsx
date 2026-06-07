import { ConfigDto, ConfigMapper } from '@app/infrastructure/dtos';
import { GetConfigs, GetSession } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { SystemSettingsView } from '@app/presentation/components/internal/system-settings';

export const metadata: Metadata = {
  title: 'System Settings',
};

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
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'System Settings', url: '/settings/system' },
        ]}
      >
        <SectionHeader title="System Settings" backUrl="/settings" />
        <SystemSettingsView configs={configs.map(ConfigMapper.fromDomainToDto) as ConfigDto[]} />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
