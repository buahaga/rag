import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import https from 'https';
import { DocumentLoader } from '../services/documentLoader';
import { RAGService } from '../services/ragService';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const DATA_DIR = path.join(process.cwd(), 'data');
const GITHUB_API_URL = 'https://api.github.com/repos/artsmia/collection/contents/objects';
const RAW_GITHUB_URL = 'https://raw.githubusercontent.com/artsmia/collection/main/objects';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

console.log('Using GitHub token:', !!GITHUB_TOKEN);

async function fetchFileList(dir = '', fileList: string[] = []): Promise<string[]> {
  const url = dir ? `${GITHUB_API_URL}/${dir}` : GITHUB_API_URL;
  const response = await axios.get(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      ...(GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {})
    }
  });
  for (const item of response.data) {
    if (item.type === 'file' && item.name.endsWith('.json')) {
      fileList.push(dir ? `${dir}/${item.name}` : item.name);
    } else if (item.type === 'dir') {
      await fetchFileList(dir ? `${dir}/${item.name}` : item.name, fileList);
    }
  }
  return fileList;
}

async function downloadGithubFile(githubPath: string, destination: string): Promise<void> {
  const url = `${RAW_GITHUB_URL}/${githubPath}`;
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
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
    const objectsDir = path.join(DATA_DIR, 'objects');
    await fsPromises.mkdir(objectsDir, { recursive: true });

    // Download all artwork JSON files
    console.log('Fetching file list from GitHub...');
    const fileList = await fetchFileList();
    console.log(`Found ${fileList.length} files. Downloading...`);
    for (const relPath of fileList) {
      const destPath = path.join(objectsDir, relPath);
      await fsPromises.mkdir(path.dirname(destPath), { recursive: true });
      await downloadGithubFile(relPath, destPath);
      console.log(`Downloaded: ${relPath}`);
    }

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
