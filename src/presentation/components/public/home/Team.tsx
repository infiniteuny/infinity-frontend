'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import { Autoplay, Navigation } from 'swiper';
import { IconButton } from '@material-tailwind/react';
import { KeyboardArrowLeftRounded, KeyboardArrowRightRounded } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { TeamMember } from '@/domain/entities';
import { TeamMemberCard } from '.';

export function Team() {
  const team: TeamMember[] = [
    {
      priority: 1,
      name: 'Satya Adhiyaksa Ardy',
      major: 'Teknologi Informasi',
      year: 2020,
      cabinet: 2022,
      division: 'President',
      photo: 'https://cms.infiniteuny.id/uploads/small_satya_adhiyaksa_ardy_5689005e78.png',
      socialMedia: {
        instagram: 'satyaadhiyaksa',
      },
    },
    {
      priority: 2,
      name: ' Maria Bernadetha Charlotta W. T.',
      major: 'Teknologi Informasi',
      year: 2020,
      cabinet: 2022,
      division: 'Vice President',
      photo: 'https://cms.infiniteuny.id/uploads/small_maria_charlotta_a7707eb666.png',
      socialMedia: {
        instagram: 'chaarlota',
      },
    },
    {
      priority: 3,
      name: 'Dany Christian',
      major: 'Pendidikan Teknik Informatika',
      year: 2020,
      cabinet: 2022,
      division: 'Team Leader',
      photo: 'https://cms.infiniteuny.id/uploads/small_dany_christian_7623ce8927.png',
      socialMedia: {},
    },
    {
      priority: 4,
      name: 'Anisatul Afita',
      major: 'Pendidikan Ilmu Pengetahuan Sosial',
      year: 2020,
      cabinet: 2022,
      division: 'Administration Leader',
      photo: 'https://cms.infiniteuny.id/uploads/small_default_a21c961d73.png',
      socialMedia: {},
    },
    {
      priority: 5,
      name: 'Satya Adhiyaksa Ardy',
      major: 'Teknologi Informasi',
      year: 2020,
      cabinet: 2022,
      division: 'President',
      photo: 'https://cms.infiniteuny.id/uploads/small_satya_adhiyaksa_ardy_5689005e78.png',
      socialMedia: {
        instagram: 'satyaadhiyaksa',
      },
    },
    {
      priority: 6,
      name: ' Maria Bernadetha Charlotta W. T.',
      major: 'Teknologi Informasi',
      year: 2020,
      cabinet: 2022,
      division: 'Vice President',
      photo: 'https://cms.infiniteuny.id/uploads/small_maria_charlotta_a7707eb666.png',
      socialMedia: {
        instagram: 'chaarlota',
      },
    },
    {
      priority: 7,
      name: 'Dany Christian',
      major: 'Pendidikan Teknik Informatika',
      year: 2020,
      cabinet: 2022,
      division: 'Team Leader',
      photo: 'https://cms.infiniteuny.id/uploads/small_dany_christian_7623ce8927.png',
      socialMedia: {},
    },
    {
      priority: 8,
      name: 'Anisatul Afita',
      major: 'Pendidikan Ilmu Pengetahuan Sosial',
      year: 2020,
      cabinet: 2022,
      division: 'Administration Leader',
      photo: 'https://cms.infiniteuny.id/uploads/small_default_a21c961d73.png',
      socialMedia: {},
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
