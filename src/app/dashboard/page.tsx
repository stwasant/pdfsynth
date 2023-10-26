import Dashboard from '@/src/components/Dashboard';
import { db } from '@/src/db';
import { getUserSesion } from '@/src/lib/utils';
// import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';


const Page = async () => {
  
  // const { getUser } = getKindeServerSession();
  const user = getUserSesion();

  console.log('user',user);
  if (!user || !user.id ) redirect('/auth-callback?origin=dashboard');

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    }
  });

  // TODO: Check it for other cases.
  if (!dbUser) redirect('/auth-callback?origin=dashboard');

  return (
    <Dashboard />
  )
}

export default Page