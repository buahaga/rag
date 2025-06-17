import { RAGService } from '../ragService';
import { Document } from '@langchain/core/documents';

describe('RAGService', () => {
  let ragService: RAGService;
  let documents: Document[];

  beforeEach(() => {
    documents = [
      new Document({
        pageContent: 'Test artwork 1',
        metadata: {
          id: '1',
          title: 'Test Artwork 1',
          artist: 'Test Artist 1',
          date: '1800',
          type: 'painting',
        },
      }),
      new Document({
        pageContent: 'Test artwork 2',
        metadata: {
          id: '2',
          title: 'Test Artwork 2',
          artist: 'Test Artist 2',
          date: '1900',
          type: 'sculpture',
        },
      }),
    ];
  });

  describe('processDocuments', () => {
    it('should process and store documents in the vector database without throwing', async () => {
      ragService = await RAGService.createWithDocuments(documents);
      expect(ragService).toBeDefined();
    });
  });

  describe('getAnswer', () => {
    beforeEach(async () => {
      ragService = await RAGService.createWithDocuments(documents);
    });

    it('should return an answer for a valid question', async () => {
      const question = 'Show me American paintings from the 19th century';
      const answer = await ragService.getAnswer(question);
      expect(answer).toBeDefined();
      // The type of answer may depend on the LLM, so just check it's not null/undefined
    });

    it('should throw for empty questions', async () => {
      await expect(ragService.getAnswer('')).rejects.toThrow();
    });
  });
}); 
