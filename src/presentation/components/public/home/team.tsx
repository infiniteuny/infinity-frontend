'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Autoplay, Navigation } from 'swiper';
import { IconButton } from '@material-tailwind/react';
import { KeyboardArrowLeftRounded, KeyboardArrowRightRounded } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { TeamMember } from '@/domain/entities';
import { TeamMemberCard } from './team-member-card';

export function Team() {
  const team: TeamMember[] = [
    {
      priority: 1,
      name: 'John Doe',
      major: 'Computer Science',
      year: 2019,
      cabinet: 2020,
      division: 'Web Development',
      photo: '/assets/images/avatar-placeholder.jpg',
    },
  ];

  return (
    <section id="team" className="px-6 text-gray-700 md:px-12 lg:px-18">
      <div className="py-20 max-w-6xl mx-auto">
        <h2 className="mb-8 text-3xl text-center font-semibold">Team</h2>
        <Swiper
          className="mb-8"
          spaceBetween={50}
          slidesPerView={1}
          navigation={{
            nextEl: '.team-button-next',
            prevEl: '.team-button-prev',
          }}
          autoplay={{
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
          modules={[Autoplay, Navigation]}
        >
          {team.map((member) => (
            <SwiperSlide key={member.priority}>
              <TeamMemberCard teamMember={member} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex gap-4 justify-center">
          <IconButton
            size="sm"
            className="team-button-prev !bg-[#3c7c60] !shadow-[#3c7c60]/20 hover:!shadow-[#3c7c60]/40"
          >
            <KeyboardArrowLeftRounded />
          </IconButton>
          <IconButton
            size="sm"
            className="team-button-next !bg-[#3c7c60] !shadow-[#3c7c60]/20 hover:!shadow-[#3c7c60]/40"
          >
            <KeyboardArrowRightRounded />
          </IconButton>
        </div>
      </div>
    </section>
  );
}
