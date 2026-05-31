'use client';

import Image from 'next/image';
import { Box, Container, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { UserDto, UserMapper } from '@app/infrastructure/dtos';
import { DateTime } from 'luxon';

type Props = {
  user: UserDto;
};

export function OverviewView({ user }: Props) {
  const parsedUser = useMemo(() => UserMapper.fromDtoToDomain(user), [user]);
  const greeting = useMemo(
    () => [
      'Sudah ngoding apa nih hari ini? 🤔',
      'Mana prestasinya woyyyy!? 😡',
      'Hari ini push ke production atau cuma menuh-menuhin local branch doang? 🙄',
      'Udah nulis kode yang beneran jalan, atau masih copas AI? 💻',
      'Error log udah dicek belum, atau pura-pura tutup mata biar aman? 🙈',
      'Kapan terakhir kali pipeline CI/CD kamu hijau? Jangan alasan server down. 📉',
      'Commit message hari ini pasti "fixing bugs" padahal nambah bug baru kan? Ngaku aja. 🐛',
      'Berhenti scroll pilihan framework, mulai ketik logikanya. ⏳',
      'Masih nyangkut di tutorial hell atau udah mulai build sesuatu yang nyata? 🏗️',
      'Numpang nama INFINITE doang atau beneran bawa piala tahun ini? 🏆',
      'Mana data prestasinya? Kalau nggak diinput ke sistem, prestasimu cuma mitos. 👻',
      'Status keanggotaan aktif, tapi kontribusi nol. Mau sampai kapan jadi beban server? 🗑️',
      'Katanya mau grow bareng INFINITE, tapi ngerjain task satu aja nunggak seminggu. 🐢',
      'Udah lapor prestasi ke sistem, atau masih sebatas wacana di grup WA? 💬',
      'Hari ini kamu beneran produktif atau cuma sibuk ngerjain hal gampang biar merasa berguna? 🎯',
      'Lebih banyak ngeluh soal error daripada baca dokumentasinya? Fix your mindset! 🧠',
      'Ekspektasi: Senior Engineer. Realitas: Lupa titik koma nyari sejam. Belajar lagi sana! 📚',
      'Jangan cuma mimpi bikin sistem scalable kalau rapiin struktur kode sendiri aja masih malas. 🏗️',
      'Sistemnya udah automated pakai GitOps, kamunya kapan automated buat lebih disiplin? ⚙️',
    ],
    [],
  );
  // On initial render, show &nbsp; as placeholder to prevent layout shift
  const [chosenGreeting, setChosenGreeting] = useState<string>(' ');

  useEffect(() => {
    setChosenGreeting(greeting[Math.floor(Math.random() * greeting.length)]);
  }, [greeting]);

  return (
    <Box
      component="section"
      className="mb-4 flex h-[calc(100vh-18rem)] min-h-60 w-full items-center justify-center px-6"
    >
      <Container maxWidth={false} className="max-w-2xl p-0">
        <Image
          src="/assets/images/morning-news.svg"
          alt="Hello there!"
          width={300}
          height={300}
          loading="eager"
          className="mx-auto block"
        />
        <Typography variant="h4" component="h1" align="center" className="mt-8">
          Hi, {parsedUser.name}!
        </Typography>
        {parsedUser.startDate && parsedUser.endDate ? (
          <Typography variant="body1" color="text.secondary" align="center" className="mt-3">
            Member since {DateTime.fromJSDate(parsedUser.startDate).toFormat('dd/LL/yyyy')},
            expiring on {DateTime.fromJSDate(parsedUser.endDate).toFormat('dd/LL/yyyy')}.
          </Typography>
        ) : null}
        <Typography variant="h6" component="p" align="center" className="mt-1 font-normal">
          {chosenGreeting}
        </Typography>
      </Container>
    </Box>
  );
}
