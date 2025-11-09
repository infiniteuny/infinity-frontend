import { GetSession } from '@app/application';
import { LoginForm } from '@app/presentation/components/auth/login';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const metadata: Metadata = {
  title: 'Login',
};

type Props = {
  searchParams: Promise<{
    callback_url?: string;
  }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const session = await getSession.execute();
  const callbackUrl = (await searchParams).callback_url;

  if (session && !session.error) {
    if (callbackUrl) {
      redirect(callbackUrl);
    }

    redirect('/');
  }

  return (
    <section className="flex min-h-screen items-center px-6 py-20 md:px-12 lg:px-18">
      <LoginForm callbackUrl={callbackUrl} />
    </section>
  );
}
