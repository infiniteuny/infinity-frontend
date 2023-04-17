import Image from 'next/image';

export function About() {
  return (
    <section id="about" className="px-6 text-gray-700 md:px-12 lg:px-18">
      <div className="py-20 max-w-6xl mx-auto">
        <h2 className="mb-8 text-3xl text-center font-semibold text-gray-800">About Us</h2>
        <div className="flex flex-col gap-8 items-center justify-center lg:flex-row">
          <div className="mb-6 lg:flex-1 lg:mb-0">
            <Image
              src="/assets/images/about.svg"
              width={570}
              height={570}
              alt="About Us"
              className="mx-auto"
            />
          </div>
          <div className="lg:flex-1">
            <h3 className="mb-3 text-xl font-semibold text-gray-800">INFINITE UNY?</h3>
            <p className="mb-3 italic text-lg font-medium text-gray-800">
              Let&apos;s Make Infinite Technology
            </p>
            <p className="mb-3">
              INFINITE merupakan Divisi Teknologi Informasi yang berada dibawah naungan UKM Rekayasa
              Teknologi UNY. Sejak tahun 2014, INFINITE mewadahi mahasiswa dari berbagai jurusan
              yang memiliki minat dan bakat di bidang Teknologi Informasi.
            </p>
            <ul className="pl-5 list-disc marker:text-infinite-green">
              <li>
                Berkolaborasi menciptakan karya dalam bentuk mobile apps, web apps, internet of
                things, machine learning untuk menjawab permasalahan di masyarakat.
              </li>
              <li>Kesempatan mengikuti lomba baik skala nasional dan internasional.</li>
              <li>Kesempatan mengembangkan CV dan portofolio.</li>
              <li>Basecamp 24 jam.</li>
              <li>Networking.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
