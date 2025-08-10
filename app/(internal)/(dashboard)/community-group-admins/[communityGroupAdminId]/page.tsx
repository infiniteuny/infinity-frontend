import { SectionHeader } from "@app/presentation/components/internal/shared";

type Props = {
  params: Promise<{
    communityGroupAdminId: string;
  }>;
};

export default function SingleCommunityGroupAdminPage({ params }: Props) {
  return (
    <>
      <SectionHeader title="Community Group Administrator" />
    </>
  );
}
