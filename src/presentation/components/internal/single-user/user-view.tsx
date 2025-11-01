'use client';

import { ContactsView } from './contacts-view';
import { GeneralView } from './general-view';
import { MembershipView } from './membership-view';
import { MetadataView } from './metadata-view';
import { UserDto, UserMapper } from '@app/infrastructure/dtos/user.dto';

type Props = {
  initialUser: UserDto;
};

export function UserView({ initialUser }: Props) {
  const user = UserMapper.fromDtoToDomain(initialUser);

  return (
    <>
      <GeneralView user={user} />
      <ContactsView user={user} />
      <MembershipView user={user} />
      <MetadataView user={user} />
    </>
  );
}
