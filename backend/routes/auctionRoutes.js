import express from 'express';
import {
  createAuction,
  getAuctions,
  getAuction,
  updateAuction,
  deleteAuction,
  auctionController,
} from '../controllers/auctionController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, createAuction);
router.get('/', getAuctions);
router.get('/:id', getAuction);
router.put('/:id', authenticateUser, updateAuction);
router.delete('/:id', authenticateUser, deleteAuction);
router.post('/start/:id', auctionController.startAuction);

export default router;
