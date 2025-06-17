import { Document } from '@langchain/core/documents';
import fs from 'fs/promises';
import path from 'path';

export class DocumentLoader {
  private dataDir: string;

  constructor(dataDir: string = './data') {
    this.dataDir = dataDir;
  }

  async loadDocuments(): Promise<Document[]> {
    try {
      const files = await fs.readdir(this.dataDir);
      const documents: Document[] = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.dataDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          console.log(content);
          const data = JSON.parse(content);

          // Process each artwork in the JSON file
          for (const artwork of data) {
            const document = new Document({
              pageContent: this.formatArtworkContent(artwork),
              metadata: {
                id: artwork.id,
                title: artwork.title,
                artist: artwork.artist,
                date: artwork.date,
                type: artwork.type,
              },
            });
            documents.push(document);
          }
        }
      }

      return documents;
    } catch (error) {
      console.error('Error loading documents:', error);
      throw error;
    }
  }

  private formatArtworkContent(artwork: Record<string, any>): string {
    return `
      Title: ${artwork.title}
      Artist: ${artwork.artist}
      Date: ${artwork.date}
      Type: ${artwork.type}
      Description: ${artwork.description || 'No description available'}
      Cultural Context: ${artwork.culturalContext || 'No cultural context available'}
    `.trim();
  }
} 
