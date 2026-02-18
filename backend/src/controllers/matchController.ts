import { Request, Response } from 'express';
import prisma from '../config/db.js';

export const getRecommendations = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const myProfile = await prisma.profile.findUnique({
            where: { userId },
            include: { interests: true, preferences: true }
        });

        if (!myProfile) return res.status(404).json({ message: 'Profile not found' });

        const retry = req.query.retry === 'true';

        const alreadyActioned = await prisma.like.findMany({
            where: {
                fromUserId: userId,
                ...(retry ? { liked: true } : {}) // If retry, only exclude LIKED profiles (keep passed ones)
            },
            select: { toUserId: true }
        });

        const actionedIds = alreadyActioned.map(l => l.toUserId);
        if (!retry) {
            actionedIds.push(userId); // Always exclude self
        } else {
            // If retry, we might have passed self? No, self is never in like table.
            actionedIds.push(userId);
        }

        const whereClause: any = {
            userId: { notIn: actionedIds },
        };

        // Strict gender filtering based on USER request:
        // "si l utilisateur est un homme, n afficher que des utilisateur femmes vis versa"
        if (myProfile.gender === 'Homme') {
            whereClause.gender = 'Femme';
        } else if (myProfile.gender === 'Femme') {
            whereClause.gender = 'Homme';
        }

        // Use other preferences if available
        if (myProfile.preferences) {
            const { minAge, maxAge, gender } = myProfile.preferences;

            whereClause.age = {
                gte: minAge,
                lte: maxAge
            };

            // If user has a specific preference that ISN'T the default, or they are Non-Binaire etc.
            if (gender && gender !== 'Tout' && !['Homme', 'Femme'].includes(myProfile.gender)) {
                whereClause.gender = gender;
            }
        }

        const users = await prisma.profile.findMany({
            where: whereClause,
            include: {
                interests: true,
                photos: true
            }
        });

        const myInterestNames = myProfile.interests.map(i => i.name);

        const scoredUsers = users.map(user => {
            const userInterestNames = user.interests.map(i => i.name);
            const commonInterests = userInterestNames.filter(name => myInterestNames.includes(name)).length;
            return { ...user, score: commonInterests };
        }).sort((a, b) => b.score - a.score);

        res.json(scoredUsers);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const swipe = async (req: Request, res: Response) => {
    try {
        const fromUserId = (req as any).user.userId;
        const { toUserId, liked } = req.body;

        const like = await prisma.like.upsert({
            where: { fromUserId_toUserId: { fromUserId, toUserId } },
            update: { liked },
            create: { fromUserId, toUserId, liked }
        });

        if (liked) {
            const mutualLike = await prisma.like.findFirst({
                where: { fromUserId: toUserId, toUserId: fromUserId, liked: true }
            });

            if (mutualLike) {
                let existingMatch = await prisma.match.findFirst({
                    where: {
                        AND: [
                            { users: { some: { id: fromUserId } } },
                            { users: { some: { id: toUserId } } }
                        ]
                    }
                });

                if (!existingMatch) {
                    existingMatch = await prisma.match.create({
                        data: {
                            users: { connect: [{ id: fromUserId }, { id: toUserId }] }
                        }
                    });
                }
                return res.json({ match: true, matchId: existingMatch.id });
            }
        }

        res.json({ match: false });
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};
