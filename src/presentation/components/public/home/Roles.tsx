import Image from 'next/image';

export function Roles() {
  return (
    <section className="px-6 text-gray-700 md:px-12 lg:px-18">
      <div className="py-20 max-w-6xl mx-auto">
        <h2 className="mb-8 text-3xl text-center font-semibold">Roles</h2>
        <div className="flex flex-col gap-8 items-center justify-center lg:flex-row-reverse">
          <div className="mb-20 lg:flex-1 lg:mb-0">
            <Image
              src="/assets/images/roles.svg"
              width={308}
              height={289}
              alt="Roles"
              className="mx-auto mb-3"
            />
          </div>
          <div className="lg:flex-1">
            <div className="mb-3">
              <h3 className="mb-3 text-lg font-medium">Hustler</h3>
              <p>
                Seseorang yang memiliki peran dalam memperkenalkan dan memasarkan produk kepada
                konsumen.
              </p>
              <p>Skills: management, negotiation, writing, critical thinking.</p>
            </div>
            <div className="mb-3">
              <h3 className="mb-3 text-lg font-medium">Hipster</h3>
              <p>
                Seseorang yang memiliki peran dalam menyajikan dan memastikan estetika tampilan
                serta pengalaman pengguna dari sebuah produk.
              </p>
              <p>Skills: design, dopywriting, research, ideation.</p>
            </div>
            <div className="mb-3">
              <h3 className="mb-3 text-lg font-medium">Hacker</h3>
              <p>
                Seseorang yang memiliki peran dalam mengembangkan teknologi yang ada dalam produk
                (coding).
              </p>
              <p>Skills: programming, software development, network security, etc.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
