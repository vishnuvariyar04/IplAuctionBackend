import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createPlayer = async (req, res) => {
    try {
        const { name, age, nationality, type, runs, wickets, price } = req.body;
        const player = await prisma.player.create({
            data: {
                name,
                age,
                nationality,
                type,
                runs,
                wickets,
                price,
            },
        });
        res.status(201).json(player);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllPlayers = async (req, res) => {
    try {
        const players = await prisma.player.findMany();
        res.status(200).json(players);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getPlayerById = async (req, res) => {
    try {
        const player = await prisma.player.findUnique({
            where: { id: req.params.id },
        });
        if (player) {
            res.status(200).json(player);
        } else {
            res.status(404).json({ message: 'Player not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updatePlayer = async (req, res) => {
    try {
        const player = await prisma.player.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.status(200).json(player);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deletePlayer = async (req, res) => {
    try {
        await prisma.player.delete({
            where: { id: req.params.id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};