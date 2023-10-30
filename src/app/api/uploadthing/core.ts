import { db } from '@/src/db';
import { getUserSesion } from '@/src/lib/utils';
import { TRPCError } from '@trpc/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  // TODO: Error controller when is uploaded a file longer of the max.
  pdfUploader: f({ pdf: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      const user = getUserSesion();

      if (!user || !user.id) {
        // throw new TRPCError({ code: 'UNAUTHORIZED' });
        throw new Error('UNAUTHORIZED');
        }
    

      return {userId: user.id};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({

        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
          // url: file.url
        }
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
