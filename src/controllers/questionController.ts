import { Router, Request, Response } from 'express';
import { RAGService } from '../services/ragService';

const router = Router();
const ragService = new RAGService();

// POST /api/questions
router.post('/', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const answer = await ragService.getAnswer(question);
    res.json({ answer });
  } catch (error) {
    console.error('Error processing question:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const questionRouter = router; 
