import { About, Hero, Roles } from '@/presentation/components/public';
import { Contact } from '@/presentation/components/public/home/Contact';
import { Faqs } from '@/presentation/components/public/home/Faqs';
import { Team } from '@/presentation/components/public/home/Team';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Roles />
      <Team />
      <Faqs />
      <Contact />
    </>
  );
}
