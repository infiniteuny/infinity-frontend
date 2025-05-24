'use client';

import '@app/presentation/styles/public/home/faqs.css';
import Image from 'next/image';
import { AccordionIcon } from './accordion-icon';
import { useState } from 'react';

export function Faqs() {
  const [open, setOpen] = useState(1);

  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  return (
    <section id="faqs" className="px-6 text-gray-700 md:px-12 lg:px-18">
      <div className="py-20 max-w-5xl mx-auto">
        <h2 className="mb-8 text-3xl text-center font-semibold">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-8 items-center justify-center lg:flex-row">
          <div className="mb-20 lg:flex lg:flex-[2] lg:items-center lg:mb-0">
            <Image
              src="/assets/images/faqs.svg"
              width={364}
              height={364}
              alt="Roles"
              className="mx-auto mb-6"
            />
          </div>
          <div className="lg:flex-[3]">
            {/* <Accordion
              open={open === 1}
              icon={<AccordionIcon id={1} open={open} />}
              className="mb-2"
            >
              <AccordionHeader
                onClick={() => handleOpen(1)}
                className={`accordion-header ${
                  open === 1 ? '!bg-infinite-green !border-none' : ''
                }`}
              >
                <h3 className={`accordion-title ${open === 1 ? '!text-white' : ''}`}>
                  Bagaimana cara menjadi anggota INFINITE?
                </h3>
              </AccordionHeader>
              <AccordionBody className="accordion-body">
                <p>
                  Mengikuti pendaftaran Penerima Anggota Baru (PAB) UKM Rekayasa Teknologi,
                  mengikuti seluruh tahapan seleksi, dan memilih INFINITE sebagai divisi yang
                  diinginkan. Jangan lupa ya, karena PAB hanya dibuka satu kali setahun.
                </p>
              </AccordionBody>
            </Accordion>
            <Accordion
              open={open === 2}
              icon={<AccordionIcon id={2} open={open} />}
              className="mb-2"
            >
              <AccordionHeader
                onClick={() => handleOpen(2)}
                className={`accordion-header ${open === 2 ? '!bg-infinite-green' : ''}`}
              >
                <h3 className={`accordion-title ${open === 2 ? '!text-white' : ''}`}>
                  Apakah anggota lama perlu mengikuti PAB lagi setiap tahun?
                </h3>
              </AccordionHeader>
              <AccordionBody className="accordion-body">
                <p>
                  Anggota lama tidak perlu mengikuti PAB lagi, cukup melakukan daftar ulang di web.
                </p>
              </AccordionBody>
            </Accordion>
            <Accordion
              open={open === 3}
              icon={<AccordionIcon id={3} open={open} />}
              className="mb-2"
            >
              <AccordionHeader
                onClick={() => handleOpen(3)}
                className={`accordion-header ${open === 3 ? '!bg-infinite-green' : ''}`}
              >
                <h3 className={`accordion-title ${open === 3 ? '!text-white' : ''}`}>
                  Di mana lokasi <i>basecamp</i> INFINITE?
                </h3>
              </AccordionHeader>
              <AccordionBody className="accordion-body">
                <p>
                  Gedung Aula Fakultas Teknik, belakang Lembaga Penelitian dan Pengabdian kepada
                  Masyarakat (LPPM) Universitas Negeri Yogyakarta.
                </p>
              </AccordionBody>
            </Accordion>
            <Accordion
              open={open === 4}
              icon={<AccordionIcon id={4} open={open} />}
              className="mb-2"
            >
              <AccordionHeader
                onClick={() => handleOpen(4)}
                className={`accordion-header ${open === 4 ? '!bg-infinite-green' : ''}`}
              >
                <h3 className={`accordion-title ${open === 4 ? '!text-white' : ''}`}>
                  Kapan <i>basecamp</i> buka dan tutup?
                </h3>
              </AccordionHeader>
              <AccordionBody className="accordion-body">
                <p>
                  Untuk keperluan riset, <i>basecamp</i> INFINITE buka 24/7 ya!
                </p>
              </AccordionBody>
            </Accordion>
            <Accordion
              open={open === 5}
              icon={<AccordionIcon id={5} open={open} />}
              className="mb-2"
            >
              <AccordionHeader
                onClick={() => handleOpen(5)}
                className={`accordion-header ${open === 5 ? '!bg-infinite-green' : ''}`}
              >
                <h3 className={`accordion-title ${open === 5 ? '!text-white' : ''}`}>
                  Bagaimana cara mengikuti lomba, mencari anggota tim, dan mencari dosen pembimbing?
                </h3>
              </AccordionHeader>
              <AccordionBody className="accordion-body">
                <p className="mb-3">
                  Teman-teman dibebaskan mencari dan merencanakan lomba apa yang akan diikuti. Jika
                  sudah menentukan lomba, teman-teman wajib membentuk tim. Usahakan tim yang
                  dibentuk memiliki komposisi hacker, hipster dan hustler ya!
                </p>
                <p>
                  Setelah itu, untuk keperluan dosen pembimbing, usahakan teman-teman mencari dosen
                  sesuai dengan karya yang akan dikembangkan. Teman-teman dapat mencari secara
                  mandiri melalui web Staff UNY, atau meminta bantuan kepada Divisi Kompetisi.
                  Selamat berlomba!
                </p>
              </AccordionBody>
            </Accordion>
            <Accordion
              open={open === 6}
              icon={<AccordionIcon id={6} open={open} />}
              className="mb-2"
            >
              <AccordionHeader
                onClick={() => handleOpen(6)}
                className={`accordion-header ${open === 6 ? '!bg-infinite-green' : ''}`}
              >
                <h3 className={`accordion-title ${open === 6 ? '!text-white' : ''}`}>
                  Apakah saya bisa melakukan konsultasi jika masih kebingungan dalam pengembangan
                  karya?
                </h3>
              </AccordionHeader>
              <AccordionBody className="accordion-body">
                <p>
                  Teman-teman dapat menghubungi Divisi Kompetisi. Kami akan merencanakan konsultasi
                  bersama dengan kakak tingkat, alumni, ataupun dosen dengan bidang keahlian yang
                  sesuai.
                </p>
              </AccordionBody>
            </Accordion>
            <Accordion
              open={open === 7}
              icon={<AccordionIcon id={7} open={open} />}
              className="mb-2"
            >
              <AccordionHeader
                onClick={() => handleOpen(7)}
                className={`accordion-header ${open === 7 ? '!bg-infinite-green' : ''}`}
              >
                <h3 className={`accordion-title ${open === 7 ? '!text-white' : ''}`}>
                  Bagaimana cara mengajukan pendanaan riset?
                </h3>
              </AccordionHeader>
              <AccordionBody className="accordion-body">
                <p>
                  Untuk mengajukan pendanaan, teman-teman dapat mengisi formulir pengajuan pendanaan
                  di web INFINITE. Bahan-bahan yang harus disiapkan diantaranya booklet, timeline
                  lomba, RAB, anggota tim, dan LOA (dapat disusulkan). Setelah mengisi form, harap
                  melakukan konfirmasi kepada narahubung yang tertera ya!
                </p>
              </AccordionBody>
            </Accordion>
            <Accordion
              open={open === 8}
              icon={<AccordionIcon id={8} open={open} />}
              className="mb-2"
            >
              <AccordionHeader
                onClick={() => handleOpen(8)}
                className={`accordion-header ${open === 8 ? '!bg-infinite-green' : ''}`}
              >
                <h3 className={`accordion-title ${open === 8 ? '!text-white' : ''}`}>
                  Bagaimana cara berkolaborasi dengan INFINITE jika saya adalah pihak eksternal?
                </h3>
              </AccordionHeader>
              <AccordionBody className="accordion-body">
                <p>
                  Silahkan hubungi kontak yang tertera di web INFINITE, dan sertakan deskripsi kerja
                  sama yang dikehendaki. Apabila kedua belah pihak sepakat, INFINITE dengan senang
                  hati siap berkolaborasi.
                </p>
              </AccordionBody>
            </Accordion> */}
          </div>
        </div>
      </div>
    </section>
  );
}
