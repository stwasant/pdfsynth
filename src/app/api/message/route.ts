import { db } from '@/src/db';
import { getUserSesion } from '@/src/lib/utils';
import { SendMessageValidator } from '@/src/lib/validators/SendMessageValidator';
import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
  // endpoint for asking a question to a PDF file

  const body = await req.json();

  const user = getUserSesion();

  const { id: userId } = user;
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { fileId, message } = SendMessageValidator.parse(body);

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: userId,
    },
  });

  if (!file) return new Response('Not found', { status: 404 });

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId: userId,
      fileId: fileId,
    },
  });
};
