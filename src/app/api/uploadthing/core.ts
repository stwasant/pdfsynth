import { db } from '@/src/db';
import { getUserSesion } from '@/src/lib/utils';
import { TRPCError } from '@trpc/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { pinecone } from '@/src/lib/pinecone';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

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

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const httpUploadingUrl = `${process.env.UPLOADTHING_URL_APP!}${file.key}`;
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          // url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          url: httpUploadingUrl,
          uploadStatus: 'PROCESSING',
        },
      });

      // Vectorization process
      try {
        console.log('httpUploadingUrl:',httpUploadingUrl);
        const response = await fetch(httpUploadingUrl);
        const blobResponse = await response.blob();
        const loader = new PDFLoader(blobResponse);
        const pageLevelDocs = await loader.load();
        const pagesAmt = pageLevelDocs.length;
        console.log('response:',response);
        console.log('blobResponse:',blobResponse);
        console.log('loader:',loader);
        console.log('pageLevelDocs:',pageLevelDocs);
        console.log('pagesAmt:',pagesAmt);
        
        //Vectorization
        const pineconeIndex = pinecone.Index("pdfsynth");
        
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        });
        
        console.log('pineconeIndex:',pineconeIndex);
        console.log('embeddings:',embeddings);
        await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
          pineconeIndex,
          namespace: createdFile.id,
        });

        await db.file.update({
          data: {
            uploadStatus: 'SUCCESS',
          },
          where: {
            id: createdFile.id,
          },
        });
      } catch (error) {
        console.log('error:', error);
        await db.file.update({
          data: {
            uploadStatus: 'FAILED',
          },
          where: {
            id: createdFile.id,
          },
        });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
