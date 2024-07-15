import express from 'express';
import { createOwner, getAllOwners, getOwnerById, updateOwner, deleteOwner } from '../controllers/ownerController.js';

const router = express.Router();

router.post('/', createOwner);
router.get('/', getAllOwners);
router.get('/:id', getOwnerById);
router.put('/:id', updateOwner);
router.delete('/:id', deleteOwner);

export default router;