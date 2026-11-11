import {
  CommunityGroupAdminDto,
  CommunityGroupAdminMapper,
  CommunityGroupAdminMemberDto,
  CommunityGroupAdminMemberMapper,
} from '@infiniteuny/infinity-infrastructure';
import { CommunityGroupAdminsView } from '@app/presentation/components/community-group-admins';
import {
  GetCommunityGroupAdminMembers,
  GetCommunityGroupAdmins,
} from '@infiniteuny/infinity-application';
import { isRight } from 'effect/Either';
import { Main } from '@app/presentation/components/shared';
import { Metadata } from 'next';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'CG Administrator',
  description:
    'Kenali para pengelola dan fasilitator grup komunitas teknologi di INFINITE Universitas Negeri Yogyakarta.',
};

type Props = {
  searchParams?: Promise<{ year?: string }>;
};

export default async function CommunityGroupAdminsPage({ searchParams }: Props) {
  const resolvedParams = searchParams ? await searchParams : {};
  const yearParam = resolvedParams?.year;

  const getAdmins = serverContainer.get<GetCommunityGroupAdmins>(SYMBOLS.GetCommunityGroupAdmins);
  const getAdminMembers = serverContainer.get<GetCommunityGroupAdminMembers>(
    SYMBOLS.GetCommunityGroupAdminMembers,
  );

  let admins: CommunityGroupAdminDto[] = [];
  let selectedAdmin: CommunityGroupAdminDto | undefined;
  let members: CommunityGroupAdminMemberDto[] = [];

  try {
    const adminsResult = await getAdmins.execute(
      undefined,
      { year: 'DESC' },
      { perPage: 50 },
      undefined,
      false,
    );

    if (isRight(adminsResult)) {
      const [items] = adminsResult.right;
      admins = items.map(
        (item) => CommunityGroupAdminMapper.fromDomainToDto(item) as CommunityGroupAdminDto,
      );

      selectedAdmin =
        (yearParam ? admins.find((a) => String(a.year) === yearParam) : undefined) ??
        admins.find((a) => a.is_active) ??
        admins[0];

      if (selectedAdmin) {
        const membersResult = await getAdminMembers.execute(
          selectedAdmin.id,
          ['major', 'major.degree', 'major.faculty', 'membership.community_group'],
          undefined,
          { name: 'ASC' },
          { perPage: 100 },
          undefined,
          false,
        );

        if (isRight(membersResult)) {
          const [memberItems] = membersResult.right;
          members = memberItems.map(
            (m) =>
              CommunityGroupAdminMemberMapper.fromDomainToDto(m) as CommunityGroupAdminMemberDto,
          );
        }
      }
    }
  } catch {
    // Fallback to empty states
  }

  return (
    <Main>
      <CommunityGroupAdminsView admins={admins} selectedAdmin={selectedAdmin} members={members} />
    </Main>
  );
}
