'use client';

import { AccessControlView } from './access-control-view';
import { ContactsView } from './contacts-view';
import { GeneralView } from './general-view';
import { MembershipView } from './membership-view';
import { MetadataView } from './metadata-view';
import { UserDto, UserMapper } from '@app/infrastructure/dtos/user.dto';

type Props = {
  initialUser: UserDto;
  isProfileView?: boolean;
};

export function UserView({ initialUser, isProfileView }: Props) {
  const user = UserMapper.fromDtoToDomain(initialUser);

  return (
    <>
      <GeneralView user={user} />
      <ContactsView user={user} />
      <MembershipView user={user} isProfileView={isProfileView} />
      <AccessControlView user={user} isProfileView={isProfileView} />
      <MetadataView user={user} />
    </>
  );
}
