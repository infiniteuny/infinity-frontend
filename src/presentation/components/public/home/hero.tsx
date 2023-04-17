import Image from 'next/image';

export function Hero() {
  return (
    <section className="px-6 bg-infinite-green text-white md:px-12 lg:px-18">
      <div
        className="py-28 min-h-screen max-w-6xl mx-auto flex flex-col items-center justify-center
        lg:flex-row-reverse"
      >
        <div className="mb-20 lg:flex-1 lg:mb-0">
          <Image
            src="/assets/images/infinite-3d.png"
            width={290}
            height={193}
            alt="INFINITE UNY"
            className="mx-auto lg:w-96"
          />
        </div>
        <div className="text-center lg:flex-[2] lg:text-left">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">INFINITE UNY</h1>
          <p className="mb-2 text-2xl font-bold sm:text-3xl md:text-4xl">
            Tempat para pecinta teknologi berkumpul &#129309;
          </p>
          <p>Divisi Teknologi Informasi &bull; UKM Rekayasa Teknologi UNY</p>
        </div>
      </div>
    </section>
  );
}
