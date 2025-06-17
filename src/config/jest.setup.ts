import dotenv from 'dotenv';

// Load environment variables from .env.test if it exists, otherwise from .env
dotenv.config({ path: '.env.test' });

// Mock environment variables for testing
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'test-api-key';
process.env.CHROMA_DB_PATH = './data/chroma-test';

// Increase timeout for tests that might take longer
jest.setTimeout(30000); 
