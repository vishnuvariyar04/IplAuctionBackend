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
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  });
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/', authenticateUser, createAuction);
router.post('/', authenticateUser, upload.single('rules_file'), createAuction);
router.get('/', getAuctions);
router.get('/:id', getAuction);
router.put('/:id', authenticateUser, updateAuction);
router.delete('/:id', authenticateUser, deleteAuction);
router.post('/start/:id', auctionController.startAuction);

export default router;
