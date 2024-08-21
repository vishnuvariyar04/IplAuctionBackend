import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const placeBid = async (req, res) => {
    try {
        const { amount, playerId, ownerId, auctionId } = req.body;
        const bid = await prisma.bid.create({
            data: {
                amount,
                playerId,
                ownerId,
                auctionId,
            },
        });
        res.status(201).json(bid);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getBidsForAuction = async (req, res) => {
    try {
        const { auctionId } = req.params;
        const bids = await prisma.bid.findMany({
            where: { auctionId },
        });
        res.status(200).json(bids);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
