import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SettingsView } from '@app/presentation/components/internal/settings';

export default function SettingsPage() {
  return (
    <>
      <SectionHeader title="Settings" />
      <SettingsView />
    </>
  );
}
