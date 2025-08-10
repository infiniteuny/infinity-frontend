import { AUTH } from '@config/auth';
import { LoginForm } from '@app/presentation/components/auth/login';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Login',
};

type Props = {
  searchParams: Promise<{
    callback_url?: string;
  }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const session = await AUTH.auth();
  const callbackUrl = (await searchParams).callback_url;

  if (session) {
    if (callbackUrl) {
      redirect(callbackUrl);
    }

    redirect('/');
  }

  return (
    <section className="flex items-center px-6 py-20 min-h-screen md:px-12 lg:px-18">
      <LoginForm callbackUrl={callbackUrl} />
    </section>
  );
}
