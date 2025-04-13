import Image from 'next/image';
import { TeamMember } from '@/domain/entities';

type Props = {
  teamMember: TeamMember;
};

export function TeamMemberCard({ teamMember }: Props) {
  // return (
  //   <Card
  //     shadow={false}
  //     className="max-w-[17rem] h-full mx-auto mb-2 bg-white border !border-gray-300 rounded-2xl"
  //   >
  //     <CardHeader
  //       floated={false}
  //       shadow={false}
  //       className="mx-auto mt-7 max-h-52 max-w-[13rem] h-full w-full aspect-square rounded-full"
  //     >
  //       <Image src={teamMember.photo} width={512} height={512} alt={teamMember.name} />
  //     </CardHeader>
  //     <CardBody className="text-center">
  //       <div>
  //         <h4 className="mb-2">{teamMember.division}</h4>
  //         <h3 className="mb-1 text-xl font-medium">{teamMember.name}</h3>
  //         <h5 className="mb-2 text-sm">
  //           {teamMember.major} {teamMember.year}
  //         </h5>
  //       </div>
  //     </CardBody>
  //   </Card>
  // );
}
