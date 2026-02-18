import { Request, Response } from 'express';
import prisma from '../config/db.js';

export const getMyMatches = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const matches = await prisma.match.findMany({
            where: {
                users: { some: { id: userId } }
            },
            include: {
                users: {
                    where: { id: { not: userId } },
                    include: {
                        profile: {
                            include: {
                                photos: true,
                                interests: true
                            }
                        }
                    }
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                },
                _count: {
                    select: {
                        messages: {
                            where: {
                                senderId: { not: userId },
                                status: { not: 'READ' }
                            }
                        }
                    }
                }
            }
        });

        // Debug: log the first match structure
        if (matches.length > 0) {
            console.log('Sample match structure:', JSON.stringify(matches[0], null, 2));
        }

        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { matchId } = req.params;
        const userId = (req as any).user.userId;

        // Mark incoming messages as READ when opening the chat
        await prisma.message.updateMany({
            where: {
                matchId: matchId as string,
                senderId: { not: userId },
                status: { not: 'READ' }
            },
            data: { status: 'READ' }
        });

        const messages = await prisma.message.findMany({
            where: { matchId: matchId as string },
            orderBy: { createdAt: 'asc' }
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { matchId, content, type } = req.body;

        const message = await prisma.message.create({
            data: {
                matchId,
                senderId: userId,
                content,
                type: type || 'text'
            }
        });

        // We'll handle real-time via Socket.io elsewhere or by emitting here if we had 'io'
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { messageId } = req.params;

        const message = await prisma.message.findUnique({
            where: { id: messageId }
        });

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        if (message.senderId !== userId) {
            return res.status(403).json({ error: 'Not authorized to delete this message' });
        }

        await prisma.message.delete({
            where: { id: messageId }
        });

        res.json({ message: 'Message deleted', id: messageId, matchId: message.matchId });
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};
