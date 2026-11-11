import { NestedMenu, PathMenu, UrlMenu } from '@infiniteuny/infinity-domain';

export * from './fonts';
export * from './themes';
export { SYMBOLS } from '@infiniteuny/infinity-domain';

export interface FaqItem {
  question: string;
  answer: string;
}

export const APP: {
  site: {
    url: string;
    title: string;
    tagline: string;
    description: string;
    image: string;
    locale: string;
    youtubeEmbedUrl: string;
  };
  nav: {
    menus: (PathMenu | UrlMenu | NestedMenu<Omit<PathMenu, 'icon'> | Omit<UrlMenu, 'icon'>>)[];
  };
  footer: {
    menus: NestedMenu<Omit<PathMenu, 'icon'> | Omit<UrlMenu, 'icon'>>[];
  };
  contacts: {
    id: string;
    text: string;
    link: string;
  }[];
  faqs: FaqItem[];
} = {
  site: {
    url: 'https://www.infiniteuny.id',
    title: 'INFINITE UNY',
    tagline: "Let's Make Infinite Technology!",
    description:
      'INFINITE merupakan Divisi Teknologi Informasi di bawah naungan UKM Rekayasa Teknologi UNY.',
    image: 'https://www.infiniteuny.id/assets/images/og-image.png',
    locale: 'id-ID',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/LfaMVlDaQ24',
  },
  nav: {
    menus: [
      {
        name: 'Program',
        items: [
          {
            name: 'Kompetisi',
            path: '/competitions',
            matcher: '^\\/competitions',
          },
          {
            name: 'Prestasi',
            path: '/achievements',
            matcher: '^\\/achievements',
          },
        ],
      },
      {
        name: 'Komunitas',
        items: [
          {
            name: 'Persona',
            path: '/#personas',
            matcher: '^\\/(\\?.*?)?#personas',
          },
          {
            name: 'Grup',
            path: '/#groups',
            matcher: '^\\/(\\?.*?)?#groups',
          },
        ],
      },
      {
        name: 'Tentang Kami',
        items: [
          {
            name: 'Profil',
            path: '/#about',
            matcher: '^\\/(\\?.*?)?#about',
          },
          {
            name: 'Core Team',
            path: '/core-teams',
            matcher: '^\\/core-teams',
          },
          {
            name: 'CG Administrator',
            path: '/community-group-admins',
            matcher: '^\\/community-group-admins',
          },
          {
            name: 'Cek Anggota',
            path: '/members/verify',
            matcher: '^\\/members/verify',
          },
        ],
      },
      {
        name: 'Kontak',
        path: '/#contacts',
        matcher: '^\\/(\\?.*?)?#contacts',
      },
    ],
  },
  footer: {
    menus: [
      {
        name: 'Program',
        items: [
          {
            name: 'Kompetisi',
            path: '/competitions',
          },
          {
            name: 'Prestasi',
            path: '/achievements',
          },
        ],
      },
      {
        name: 'Komunitas',
        items: [
          {
            name: 'Persona',
            path: '/#personas',
          },
          {
            name: 'Grup',
            path: '/#groups',
          },
          {
            name: 'Testimoni',
            path: '/#testimonials',
          },
        ],
      },
      {
        name: 'Tentang Kami',
        items: [
          {
            name: 'Profil',
            path: '/#about',
          },
          {
            name: 'Core Team',
            path: '/core-teams',
          },
          {
            name: 'CG Administrator',
            path: '/community-group-admins',
          },
          {
            name: 'Cek Anggota',
            path: '/members/verify',
          },
          {
            name: 'FAQ',
            path: '/#faq',
          },
        ],
      },
      {
        name: 'Institusi',
        items: [
          {
            name: 'Universitas Negeri Yogyakarta',
            url: 'https://uny.ac.id',
          },
          {
            name: 'UKM Rekayasa Teknologi',
            url: 'https://restek-uny.id',
          },
        ],
      },
    ],
  },
  contacts: [
    {
      id: 'address',
      text: 'Basecamp INFINITE, Lab. Rekayasa Teknologi UNY Lt. 4, Jl. Colombo No. 1, Karangmalang, Caturtunggal, Depok, Sleman, Daerah Istimewa Yogyakarta 55281',
      link: '',
    },
    {
      id: 'email',
      text: 'infinite@student.uny.ac.id',
      link: 'mailto:infinite@student.uny.ac.id',
    },
    {
      id: 'whatsapp',
      text: '+62 851 8781 5148',
      link: 'https://wa.me/6285187815148',
    },
    {
      id: 'instagram',
      text: '@infinite.uny',
      link: 'https://www.instagram.com/infinite.uny/',
    },
    {
      id: 'discord',
      text: 'INFINITE UNY',
      link: 'https://discord.infiniteuny.id',
    },
    {
      id: 'x',
      text: '@infinite_uny',
      link: 'https://x.com/infinite_uny',
    },
  ],
  faqs: [
    {
      question: 'Apa itu INFINITE?',
      answer:
        'INFINITE merupakan Divisi Teknologi Informasi yang berkedudukan di bawah naungan UKM Rekayasa Teknologi (Restek) di Universitas Negeri Yogyakarta.',
    },
    {
      question: 'Apa saja kegiatan di INFINITE?',
      answer:
        'Kegiatan di INFINITE meliputi pelatihan dan mentoring rutin, persiapan dan pembinaan lomba IT (seperti GEMASTIK, LIDM, PKM, Hackathon), kolaborasi proyek pengembangan produk digital, webinar/workshop teknologi, serta persiapan karir dan networking bersama alumni dan praktisi industri.',
    },
    {
      question: 'Apakah harus dari prodi IT untuk bergabung dengan INFINITE?',
      answer:
        'Tidak harus! INFINITE terbuka bagi seluruh mahasiswa aktif Universitas Negeri Yogyakarta dari berbagai program studi dan fakultas yang memiliki minat serta antusiasme tinggi di bidang teknologi informasi, desain produk digital, maupun bisnis teknologi.',
    },
    {
      question: 'Bagaimana cara bergabung menjadi anggota INFINITE?',
      answer:
        'Pendaftaran anggota baru INFINITE dibuka setiap tahun melalui rangkaian Open Recruitment UKM Rekayasa Teknologi UNY. Pantau terus informasi terbarunya melalui Instagram resmi @infinite.uny.',
    },
    {
      question: 'Apakah saya harus sudah jago koding sebelum mendaftar?',
      answer:
        'Tentu tidak! Di INFINITE kita belajar dan bertumbuh bersama dari dasar hingga tingkat lanjut melalui komunitas belajar, mentoring, dan kolaborasi proyek nyata.',
    },
    {
      question: 'Apa itu Hustler, Hipster, dan Hacker di INFINITE?',
      answer:
        'Hustler, Hipster, dan Hacker adalah 3 persona utama dalam membangun produk teknologi: Hustler berfokus pada manajemen produk, aspek bisnis, dan komunikasi; Hipster berfokus pada desain antarmuka dan pengalaman pengguna (UI/UX) dan aspek estetika; sedangkan Hacker berfokus pada rekayasa perangkat lunak, data, keamanan siber, dan hal teknis lainnya.',
    },
    {
      question: 'Bagaimana cara mengecek status keanggotaan saya di INFINITE?',
      answer:
        'Kamu dapat mengecek status keanggotaan aktif maupun anggota luar biasa secara langsung melalui halaman Cek Anggota dengan memasukkan Nomor Induk Mahasiswa (NIM).',
    },
    {
      question: 'Apakah INFINITE menerima kerja sama atau kolaborasi acara?',
      answer:
        'Ya! Kami sangat terbuka untuk kolaborasi kegiatan, media partner, workshop, maupun pengembangan proyek teknologi. Silakan hubungi kami melalui salah satu kanal komunikasi resmi.',
    },
  ],
};
