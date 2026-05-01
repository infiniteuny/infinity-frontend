import { GetGroup } from '@app/application';
import { GroupDto, GroupMapper } from '@app/infrastructure/dtos';
import {
  GroupForm,
  GroupToolbar,
  GroupView,
} from '@app/presentation/components/internal/single-group';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    groupId: string;
  }>;
};

export default async function SingleGroupPage({ params }: Props) {
  const groupId = (await params).groupId;

  if (groupId !== 'new') {
    const getGroup = serverContainer.get<GetGroup>(SYMBOLS.GetGroup);
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

    return (
      <>
        <SectionHeader title={group.name}>
          <GroupToolbar groupId={group.id} />
        </SectionHeader>
        <GroupView initialGroup={GroupMapper.fromDomainToDto(group) as GroupDto} />
      </>
    );
  } else {
    return <GroupForm />;
  }
}
