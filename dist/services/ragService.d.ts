import { Document } from '@langchain/core/documents';
import { AIMessageChunk } from '@langchain/core/messages';
export declare class RAGService {
    private embeddings;
    private vectorStore;
    private llm;
    constructor();
    processDocuments(documents: Document[]): Promise<void>;
    getAnswer(question: string): Promise<AIMessageChunk>;
}
//# sourceMappingURL=ragService.d.ts.map