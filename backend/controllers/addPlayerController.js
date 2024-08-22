import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const addPlayerToTeam = async (req, res) => {
    try {
        const { playerId, teamId } = req.body;
        const player = await prisma.player.update({
            where: { id: playerId },
            data: { teamId },
        });
        res.status(200).json(player);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const removePlayerFromTeam = async (req, res) => {
    try {
        const { playerId } = req.body;
        const player = await prisma.player.update({
            where: { id: playerId },
            data: { teamId: null },
        });
        res.status(200).json(player);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
