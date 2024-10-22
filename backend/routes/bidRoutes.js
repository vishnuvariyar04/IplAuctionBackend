import express from 'express';
import { placeBid, getBidsForAuction } from '../controllers/bidController.js';

const router = express.Router();

router.post('/place', placeBid);
router.get('/:auctionId', getBidsForAuction);

export default router;
