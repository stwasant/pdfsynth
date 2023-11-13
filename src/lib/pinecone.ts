import { Pinecone } from '@pinecone-database/pinecone';

export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: 'gcp-starter'
})


// import { Pinecone } from "@pinecone-database/pinecone";      

// const pinecone = new Pinecone();      
// await pinecone.init({      
// 	environment: "gcp-starter",      
// 	apiKey: "********-****-****-****-************",      
// });      
// const index = pinecone.Index("pdfsynth");