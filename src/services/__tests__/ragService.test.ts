import { RAGService } from '../ragService';
import { Document } from '@langchain/core/documents';

describe('RAGService', () => {
  let ragService: RAGService;

  beforeEach(() => {
    ragService = new RAGService();
  });

  describe('processDocuments', () => {
    it('should process documents and store them in the vector database', async () => {
      const documents = [
        new Document({
          pageContent: 'Test artwork 1',
          metadata: {
            id: '1',
            title: 'Test Artwork 1',
            artist: 'Test Artist 1',
            date: '1800',
            type: 'painting'
          }
        }),
        new Document({
          pageContent: 'Test artwork 2',
          metadata: {
            id: '2',
            title: 'Test Artwork 2',
            artist: 'Test Artist 2',
            date: '1900',
            type: 'sculpture'
          }
        })
      ];

      await expect(ragService.processDocuments(documents)).resolves.not.toThrow();
    });
  });

  describe('getAnswer', () => {
    it('should return an answer for a valid question', async () => {
      const question = 'Show me American paintings from the 19th century';
      const answer = await ragService.getAnswer(question);
      
      expect(answer).toBeDefined();
      expect(typeof answer).toBe('string');
    });

    it('should handle empty questions', async () => {
      await expect(ragService.getAnswer('')).rejects.toThrow();
    });
  });
}); 
