import { CoreTeamMember } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  coreTeamMember: CoreTeamMember;
};

export function MetadataView({ coreTeamMember }: Props) {
  return (
    <EntityMetadataView
      id={coreTeamMember.membership.id}
      createdAt={coreTeamMember.membership.createdAt}
      updatedAt={coreTeamMember.membership.updatedAt}
      extraItems={[
        { title: 'User ID', subtitle: coreTeamMember.membership.userId },
        { title: 'Division ID', subtitle: coreTeamMember.membership.coreTeamDivisionId },
      ]}
    />
  );
}
