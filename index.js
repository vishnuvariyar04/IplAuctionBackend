import express from 'express';
import http from 'http';
import teamRoutes from './routes/teamRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import auctionRoutes from './routes/auctionRoutes.js';
// import teamRoutes from './routes/addPlayerRoutes.js';
import { setupSocket } from './socket.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';

const app = express();
const server = http.createServer(app);
setupSocket(server);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/teams', teamRoutes);


app.get('/', (req, res) => {
    res.send('Hello');
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
