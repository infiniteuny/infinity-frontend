import { GetGroup } from '@app/application';
import { match } from 'effect/Either';
import { GroupDto, GroupMapper } from '@app/infrastructure/dtos';
import { GroupForm } from '@app/presentation/components/internal/single-group';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { NotFoundError } from '@app/domain/errors';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    groupId: string;
  }>;
};

export default async function SingleGroupEditPage({ params }: Props) {
  const getGroup = serverContainer.get<GetGroup>(SYMBOLS.GetGroup);
  const groupId = (await params).groupId;
  const groupResult = await getGroup.execute(groupId);
  const group = match(groupResult, {
    onLeft: (error) => {
      if (error instanceof NotFoundError) {
        notFound();
      } else {
        throw error;
      }
    },
    onRight: (data) => data,
  });

  return <GroupForm initialGroup={GroupMapper.fromDomainToDto(group) as GroupDto} />;
}
