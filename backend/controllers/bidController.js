import { Server } from 'socket.io';

let io;

export const initializeBidController = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinAuction', (auctionId) => {
      socket.join(auctionId);
      console.log(`User joined auction: ${auctionId}`);
    });

    socket.on('placeBid', (data) => {
      const { auctionId, playerId, teamId, amount } = data;
      io.to(auctionId).emit('bidUpdate', { playerId, teamId, amount });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

export const placeBid = (req, res) => {
  const { auctionId, playerId, teamId, amount } = req.body;
  io.to(auctionId).emit('bidUpdate', { playerId, teamId, amount });
  res.status(200).json({ message: 'Bid placed successfully' });
};

export const getBidsForAuction = (req, res) => {
  res.status(200).json({ message: 'Bids are managed client-side' });
};
