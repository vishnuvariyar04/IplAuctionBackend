import express from 'express';
import { addPlayerToTeam, removePlayerFromTeam } from '../controllers/addPlayerController.js';

const router = express.Router();

router.post('/add', addPlayerToTeam);
router.post('/remove', removePlayerFromTeam);

export default router;
