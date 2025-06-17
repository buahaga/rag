import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { AIMessageChunk } from '@langchain/core/messages';
import dotenv from 'dotenv';
dotenv.config();

export class RAGService {
  private embeddings: OpenAIEmbeddings;
  private vectorStore: Chroma;
  private llm: ChatOpenAI;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    this.llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-3.5-turbo',
    });
    // Vector store will be initialized in processDocuments
    this.vectorStore = null as any;
  }


  /**
   * Factory method to create and initialize a RAGService instance.
   * Usage:
   *   const ragService = await RAGService.createWithDocuments(documents);
   *   const answer = await ragService.getAnswer('Your question');
   */
  static async createWithDocuments(documents: Document[]): Promise<RAGService> {
    const instance = new RAGService();
    await instance.processDocuments(documents);
    return instance;
  }

  async processDocuments(documents: Document[]): Promise<void> {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await textSplitter.splitDocuments(documents);
    this.vectorStore = await Chroma.fromDocuments(
      chunks,
      this.embeddings,
      {
        collectionName: 'museum-artworks',
        url: process.env.CHROMA_DB_PATH || './data/chroma',
      }
    );
  }

  async getAnswer(question: string): Promise<AIMessageChunk> {
    if (!this.vectorStore) {
      await this.processDocuments([]);
    }
    const results = await this.vectorStore.similaritySearch(question, 3);
    const context = results.map(doc => doc.pageContent).join('\n\n');
    const prompt = `
      Based on the following context, please answer the question.
      If the answer cannot be found in the context, say so.
      
      Context:
      ${context}
      
      Question: ${question}
      
      Answer:`;
    return this.llm.invoke(prompt);
  }
} 
