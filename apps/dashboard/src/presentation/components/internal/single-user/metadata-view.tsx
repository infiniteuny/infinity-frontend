import { User } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  user: User;
};

export function MetadataView({ user }: Props) {
  return <EntityMetadataView id={user.id} createdAt={user.createdAt} updatedAt={user.updatedAt} />;
}
