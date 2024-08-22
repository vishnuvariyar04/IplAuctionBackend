import express from 'express';
import {
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  joinAuction,
} from '../controllers/teamController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, createTeam);
router.get('/', getTeams);
router.get('/:id', getTeam);
router.put('/:id', authenticateUser, updateTeam);
router.delete('/:id', authenticateUser, deleteTeam);
router.post('/:id/join-auction', authenticateUser, joinAuction);

export default router;
