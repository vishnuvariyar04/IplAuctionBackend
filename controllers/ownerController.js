import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

export const createOwner = async (req, res) => {
    try {
        const { ownername, email, password, teamname } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); // Assuming bcrypt is used for hashing passwords
        const owner = await prisma.owner.create({
            data: {
                name: ownername,
                email,
                password: hashedPassword,
                team: {
                    create: {
                        name: teamname,
                    },
                },
            },
        });
        res.status(201).json(owner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllOwners = async (req, res) => {
    try {
        const owners = await prisma.owner.findMany({
            include: {
                team: true, // Include team details in the response
            },
        });
        res.status(200).json(owners);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getOwnerById = async (req, res) => {
    try {
        const owner = await prisma.owner.findUnique({
            where: { id: req.params.id },
            include: {
                team: true, // Include team details in the response
            },
        });
        if (owner) {
            res.status(200).json(owner);
        } else {
            res.status(404).json({ message: 'Owner not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateOwner = async (req, res) => {
    try {
        const { teamname, ...ownerData } = req.body;
        const owner = await prisma.owner.update({
            where: { id: req.params.id },
            data: {
                ...ownerData,
                team: {
                    update: {
                        where: { ownerId: req.params.id },
                        data: { name: teamname },
                    },
                },
            },
        });
        res.status(200).json(owner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteOwner = async (req, res) => {
    try {
        await prisma.team.deleteMany({
            where: { ownerId: req.params.id },
        });
        await prisma.owner.delete({
            where: { id: req.params.id },
        });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};