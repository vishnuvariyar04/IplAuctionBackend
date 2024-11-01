import express from 'express';
import http from 'http';
import teamRoutes from './routes/teamRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import auctionRoutes from './routes/auctionRoutes.js';
// import teamRoutes from './routes/addPlayerRoutes.js';
// import { setupSocket } from './socket.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import multer from 'multer';
import path from 'path';
import { initializeBidController } from './controllers/bidController.js';
import bidRoutes from './routes/bidRoutes.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  });
const upload = multer({ storage: storage });
const app = express();
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// setupSocket(server);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.any());
app.use(cors());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/bids', bidRoutes);

// app.use(cors({
//     origin: 'exp://192.168.43.143:8081', // Replace with your frontend's URL
//     credentials: true,
//   }));


app.get('/', (req, res) => {
    res.send('Hello');
});

initializeBidController(server);