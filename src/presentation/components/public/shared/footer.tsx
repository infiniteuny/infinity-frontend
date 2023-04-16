import { PathMenu, UrlMenu } from '@/domain/entities';
import { InfiniteTextLogo } from '@/presentation/components/shared';

type Props = {
  menus?: (PathMenu | UrlMenu)[][];
};

export function PublicFooter({ menus }: Props) {
  return (
    <>
      <section className="px-6 text-gray-700 bg-[#3c7c60] md:px-12 lg:px-18">
        <div className="flex flex-col gap-10 py-10 max-w-6xl mx-auto items-center justify-center md:flex-row md:justify-between">
          <div>
            <InfiniteTextLogo width={180} height={65} />
          </div>
          <div className="flex gap-5 w-full max-w-sm justify-between md:max-w-sm">
            {menus
              ? menus.map((menus, i) => (
                  <ul key={i} className="flex flex-col flex-1 text-sm text-white lg:text-base">
                    {menus.map((menu, j) => {
                      if (menu.hasOwnProperty('path')) {
                        return (
                          <a key={j} href={(menu as PathMenu).path} className="py-1">
                            <li>{menu.name}</li>
                          </a>
                        );
                      } else if (menu.hasOwnProperty('url')) {
                        return (
                          <a key={j} href={(menu as UrlMenu).url} className="py-1">
                            <li>{menu.name}</li>
                          </a>
                        );
                      }
                    })}
                  </ul>
                ))
              : null}
          </div>
        </div>
      </section>
      <footer className="flex items-center h-12 px-6 md:px-12 lg:px-18">
        <p className="max-w-2xl mx-auto text-slate-400 text-sm text-center font-mono">
          Made with &#128154; by INFINITE UNY. &copy; {new Date().getFullYear()} INFINITE UNY.
        </p>
      </footer>
    </>
  );
}
