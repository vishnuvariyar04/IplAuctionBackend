import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let io;
let currentAuctions = {};

export const initializeBidController = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinAuction', async (auctionId) => {
      socket.join(auctionId);
      console.log(`User joined auction: ${auctionId}`);

      if (!currentAuctions[auctionId]) {
        const auction = await prisma.auction.findUnique({
          where: { id: auctionId },
          include: { players: true }
        });
        currentAuctions[auctionId] = {
          currentPlayerIndex: 0,
          players: auction.players,
          currentBid: auction.players[0].price,
          timeLeft: auction.bid_duration * 60,
          timer: null
        };
        startAuctionTimer(auctionId);
      }

      // Send current player data to the newly joined user
      socket.emit('playerUpdate', {
        player: currentAuctions[auctionId].players[currentAuctions[auctionId].currentPlayerIndex],
        currentBid: currentAuctions[auctionId].currentBid,
        timeLeft: currentAuctions[auctionId].timeLeft
      });
    });

    socket.on('placeBid', (data) => {
      const { auctionId, playerId, teamId, amount } = data;
      currentAuctions[auctionId].currentBid = amount;
      io.to(auctionId).emit('bidUpdate', { playerId, teamId, amount });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

const startAuctionTimer = (auctionId) => {
  const auction = currentAuctions[auctionId];
  auction.timer = setInterval(() => {
    auction.timeLeft--;
    if (auction.timeLeft <= 0) {
      clearInterval(auction.timer);
      moveToNextPlayer(auctionId);
    }
    io.to(auctionId).emit('playerUpdate', {
      player: auction.players[auction.currentPlayerIndex],
      currentBid: auction.currentBid,
      timeLeft: auction.timeLeft
    });
  }, 1000);
};

const moveToNextPlayer = (auctionId) => {
  const auction = currentAuctions[auctionId];
  auction.currentPlayerIndex++;
  if (auction.currentPlayerIndex >= auction.players.length) {
    // Auction ended
    io.to(auctionId).emit('auctionEnded');
    delete currentAuctions[auctionId];
  } else {
    auction.currentBid = auction.players[auction.currentPlayerIndex].price;
    auction.timeLeft = 60; // Reset timer for new player
    startAuctionTimer(auctionId);
  }
};

export const placeBid = (req, res) => {
  const { auctionId, playerId, teamId, amount } = req.body;
  io.to(auctionId).emit('bidUpdate', { playerId, teamId, amount });
  res.status(200).json({ message: 'Bid placed successfully' });
};

export const getBidsForAuction = (req, res) => {
  res.status(200).json({ message: 'Bids are managed client-side' });
};