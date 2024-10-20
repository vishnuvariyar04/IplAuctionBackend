import express from 'express';
import {
  createPlayer,
  getPlayers,
  getPlayer,
  updatePlayer,
  deletePlayer,
} from '../controllers/playerController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, createPlayer);
router.get('/', getPlayers);
router.get('/:id', getPlayer);
router.put('/:id', authenticateUser, updatePlayer);
router.delete('/:id', authenticateUser, deletePlayer);


export default router;
