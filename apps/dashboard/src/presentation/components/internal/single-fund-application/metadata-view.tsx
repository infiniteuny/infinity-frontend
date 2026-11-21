import { FundApplication } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  fundApplication: FundApplication;
};

export function MetadataView({ fundApplication }: Props) {
  return (
    <EntityMetadataView
      id={fundApplication.id}
      createdAt={fundApplication.createdAt}
      updatedAt={fundApplication.updatedAt}
    />
  );
}
