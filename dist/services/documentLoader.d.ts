import { Document } from '@langchain/core/documents';
export declare class DocumentLoader {
    private dataDir;
    constructor(dataDir?: string);
    loadDocuments(): Promise<Document[]>;
    private formatArtworkContent;
}
//# sourceMappingURL=documentLoader.d.ts.map