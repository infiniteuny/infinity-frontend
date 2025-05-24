import { About, Contact, Faqs, Hero, Roles, Team } from '@app/presentation/components/public/home';

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
