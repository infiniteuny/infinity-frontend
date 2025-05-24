import { SectionHeader } from '@app/presentation/components/internal/shared';

type Props = {
  params: Promise<{
    permissionId: string;
  }>;
};

export default function SinglePermissionPage({ params }: Props) {
  return (
    <>
      <SectionHeader title="Permission" />
    </>
  );
}
