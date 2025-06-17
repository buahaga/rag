# Museum RAG Question-Answering System

A Retrieval-Augmented Generation (RAG) system for answering questions about museum artwork using Node.js and TypeScript.

## Features

- Document processing and chunking
- Vector embeddings using OpenAI
- Vector storage with ChromaDB
- Question answering using OpenAI GPT
- REST API interface
- TypeScript implementation

## Prerequisites

- Node.js (v20 or higher)
- npm (v10 or higher)
- OpenAI API key
- Github Tocken (Public Read Access is enough)
- Docker 

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd rag
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
OPENAI_API_KEY=your_openai_api_key
GITHUB_TOKEN=your_token
CHROMA_DB_PATH=./data/chroma
NODE_ENV=development
PORT=3000
```

## Usage

1. Run local ChromaDB:
```bash
docker-compose up -d
```

2. Prepare the data:
```bash
npm run setup
```

3. For development with hot-reload:
```bash
npm run dev
```
The API will be available at `http://localhost:3000`

## API Endpoints

### POST /api/questions
Ask a question about the museum collection.

Request body:
```json
{
  "question": "Show me American paintings from the 19th century"
}
```

Response:
```json
{
  "answer": "Based on the collection, here are some notable American paintings from the 19th century...",
  "sources": [
    {
      "title": "Painting Title",
      "artist": "Artist Name",
      "date": "1880"
    }
  ]
}
```

## Development

- Run tests: `npm test`
- Lint code: `npm run lint`
- Build: `npm run build`

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # API controllers
├── services/       # Business logic
├── models/         # Data models
├── utils/          # Utility functions
└── app.ts          # Main application file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC
