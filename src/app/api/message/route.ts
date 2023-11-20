import { db } from '@/src/db';
import { openai } from '@/src/lib/openai';
import { pinecone } from '@/src/lib/pinecone';
import { getUserSesion } from '@/src/lib/utils';
import { SendMessageValidator } from '@/src/lib/validators/SendMessageValidator';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { NextRequest } from 'next/server';
import { OpenAIStream, StreamingTextResponse } from 'ai';

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

  //Vectorization
  const pineconeIndex = pinecone.Index('pdfsynth');
  // const pineconeIndex = pinecone.Index('pdfname');

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace:file.id, //TODO: check how this affect the logic
  });

  const results = await vectorStore.similaritySearch(message, 4);

  const prevMessages = await db.message.findMany({
    where: {
      fileId: fileId,
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 16,
  });

  const formattedPrevMessages = prevMessages.map((message) => ({
    role: message.isUserMessage ? ('user' as const) : ('assistant' as const),
    content: message.text,
  }));

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-1106',
    temperature: 0,
    stream: true,
    messages: [
      {
        role: 'system',
        content:
          'Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.',
      },
      {
        role: 'user',
        content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
          
    \n----------------\n
    
    PREVIOUS CONVERSATION:
    ${formattedPrevMessages.map((message) => {
      if (message.role === 'user') return `User: ${message.content}\n`;
      return `Assistant: ${message.content}\n`;
    })}
    
    \n----------------\n
    
    CONTEXT:
    ${results.map((r) => r.pageContent).join('\n\n')}
    
    USER INPUT: ${message}`,
      },
    ],
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await db.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          userId: userId,
          fileId: fileId,
        },
      });
    },
  });

  return new StreamingTextResponse(stream);
};
