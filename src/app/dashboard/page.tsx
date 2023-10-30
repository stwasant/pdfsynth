import Dashboard from '@/src/components/Dashboard';
import { db } from '@/src/db';
import { getUserSesion } from '@/src/lib/utils';
import { redirect } from 'next/navigation';

const Page = async () => {
  const user = getUserSesion();

  if (!user || !user.id) redirect('/auth-callback?origin=dashboard');

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  // TODO: Check it for other cases.
  if (!dbUser) redirect('/auth-callback?origin=dashboard');

  return <Dashboard />;
};

export default Page;
