import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import https from 'https';
import { DocumentLoader } from '../services/documentLoader';
import { RAGService } from '../services/ragService';

const MIA_DATA_URL = 'https://raw.githubusercontent.com/artsmia/collection/main/artworks.json';
const DATA_DIR = path.join(process.cwd(), 'data');

async function downloadFile(url: string, destination: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => {});
      reject(err);
    });
  });
}

async function main() {
  try {
    // Create data directory if it doesn't exist
    await fsPromises.mkdir(DATA_DIR, { recursive: true });

    // Download the data
    console.log('Downloading museum data...');
    const dataPath = path.join(DATA_DIR, 'artworks.json');
    await downloadFile(MIA_DATA_URL, dataPath);

    // Process the data
    console.log('Processing documents...');
    const documentLoader = new DocumentLoader(DATA_DIR);
    const documents = await documentLoader.loadDocuments();

    // Initialize RAG service and process documents
    console.log('Creating embeddings and storing in vector database...');
    const ragService = new RAGService();
    await ragService.processDocuments(documents);

    console.log('Data processing complete!');
  } catch (error) {
    console.error('Error processing data:', error);
    process.exit(1);
  }
}

main(); 
