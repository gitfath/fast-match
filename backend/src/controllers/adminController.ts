import { Request, Response } from 'express';
import prisma from '../config/db.js';

export const getStats = async (req: Request, res: Response) => {
    try {
        const now = new Date();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const totalUsers = await prisma.user.count();
        const activeUsersMonth = await prisma.user.count({
            where: {
                profile: {
                    updatedAt: { gte: startOfMonth }
                }
            }
        });
        const newUsersToday = await prisma.user.count({
            where: { createdAt: { gte: startOfDay } }
        });

        const totalPartners = await prisma.user.count({ where: { role: 'PARTNER' } });
        const totalMatches = await prisma.match.count();

        const completedPayments = await prisma.payment.findMany({
            where: { status: 'COMPLETED' },
            select: { amount: true, createdAt: true }
        });

        const revenueTotal = completedPayments.reduce((sum, p) => sum + p.amount, 0);
        const revenueToday = completedPayments
            .filter(p => p.createdAt >= startOfDay)
            .reduce((sum, p) => sum + p.amount, 0);

        const pendingReports = await (prisma as any).report.count({ where: { status: 'PENDING' } });

        // Activity over last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            return d;
        }).reverse();

        const activityLine = await Promise.all(last7Days.map(async (day) => {
            const nextDay = new Date(day);
            nextDay.setDate(day.getDate() + 1);

            const [inscriptions, connections] = await Promise.all([
                prisma.user.count({ where: { createdAt: { gte: day, lt: nextDay } } }),
                prisma.profile.count({ where: { updatedAt: { gte: day, lt: nextDay } } })
            ]);

            return {
                date: day.toISOString().split('T')[0],
                inscriptions,
                connections
            };
        }));

        res.json({
            users: {
                total: totalUsers,
                members: await prisma.user.count({ where: { role: 'MEMBER' } }),
                partners: totalPartners,
                newToday: newUsersToday,
                activeMonth: activeUsersMonth
            },
            revenue: {
                total: revenueTotal,
                today: revenueToday
            },
            matches: totalMatches,
            reports: {
                pending: pendingReports
            },
            activityProgress: activityLine
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getRecentActivity = async (req: Request, res: Response) => {
    try {
        const topReports = await (prisma as any).report.findMany({
            where: { status: 'PENDING' },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                reporter: { include: { profile: true } },
                reported: { include: { profile: true } }
            }
        });

        const topPayments = await prisma.payment.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { include: { profile: true } }
            }
        });

        res.json({
            reports: topReports,
            payments: topPayments
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const { status, role, verified, search } = req.query;

        const where: any = {};
        if (role) where.role = role;

        let profileWhere: any = {};
        if (status) profileWhere.accountStatus = status;
        if (verified !== undefined) profileWhere.verified = verified === 'true';

        if (Object.keys(profileWhere).length > 0) {
            where.profile = profileWhere;
        }

        if (search) {
            where.OR = [
                { email: { contains: search as string } },
                { phone: { contains: search as string } },
                { profile: { name: { contains: search as string } } },
                { profile: { pseudo: { contains: search as string } } }
            ];
        }

        const users = await prisma.user.findMany({
            where,
            include: {
                profile: true,
                business: true,
                reportsRec: true,
                sanctions: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserDetail = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId as string },
            include: {
                profile: {
                    include: {
                        photos: true,
                        interests: true,
                        preferences: true
                    }
                },
                business: true,
                payments: { orderBy: { createdAt: 'desc' } },
                reportsRec: { include: { reporter: { include: { profile: true } } } },
                sanctions: { include: { admin: { include: { profile: true } } } },
                likesSent: true,
                likesRec: true,
                matches: true
            }
        });

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserStatus = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { status, verified } = req.body;
    try {
        const profile = await prisma.profile.update({
            where: { userId: userId as string },
            data: {
                accountStatus: status || undefined,
                verified: verified !== undefined ? verified : undefined
            }
        });
        res.json(profile);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createSanction = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { type, reason, durationDays } = req.body;
    const adminId = (req as any).user.userId;

    try {
        const expiresAt = durationDays ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000) : null;

        const sanction = await (prisma as any).sanction.create({
            data: {
                userId,
                adminId,
                type,
                reason,
                expiresAt
            }
        });

        let status = 'Actif';
        if (type === 'BAN') status = 'Banni';
        if (type === 'SUSPENSION') status = 'Suspendu';

        await prisma.profile.update({
            where: { userId: userId as string },
            data: { accountStatus: status }
        });

        res.json(sanction);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllReports = async (req: Request, res: Response) => {
    try {
        const reports = await (prisma as any).report.findMany({
            include: {
                reporter: { include: { profile: true } },
                reported: { include: { profile: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(reports);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateReportStatus = async (req: Request, res: Response) => {
    const { reportId } = req.params;
    const { status } = req.body;
    try {
        const report = await (prisma as any).report.update({
            where: { id: reportId as string },
            data: { status }
        });
        res.json(report);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllTransactions = async (req: Request, res: Response) => {
    try {
        const payments = await prisma.payment.findMany({
            include: {
                user: { include: { profile: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(payments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllTickets = async (req: Request, res: Response) => {
    try {
        const tickets = await (prisma as any).supportTicket.findMany({
            include: {
                user: { include: { profile: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(tickets);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        await prisma.$transaction(async (tx) => {
            // 1. Delete Messages sent by user
            await tx.message.deleteMany({ where: { senderId: userId as string } });

            // 2. Handle Matches (where user is participant)
            const matches = await tx.match.findMany({
                where: { users: { some: { id: userId as string } } }
            });

            for (const match of matches) {
                // Delete messages in match
                await tx.message.deleteMany({ where: { matchId: match.id } });
                // Delete bookings in match
                await tx.booking.deleteMany({ where: { matchId: match.id } });
                // Delete match itself
                await tx.match.delete({ where: { id: match.id } });
            }

            // 3. Delete Likes
            await tx.like.deleteMany({
                where: {
                    OR: [
                        { fromUserId: userId as string },
                        { toUserId: userId as string }
                    ]
                }
            });

            // 4. Delete Reports
            await tx.report.deleteMany({
                where: {
                    OR: [
                        { reporterId: userId as string },
                        { reportedId: userId as string }
                    ]
                }
            });

            // 5. Delete Sanctions
            await tx.sanction.deleteMany({ where: { userId: userId as string } });
            await tx.sanction.deleteMany({ where: { adminId: userId as string } });

            // 6. Delete Support Tickets
            await tx.supportTicket.deleteMany({ where: { userId: userId as string } });

            // 7. Delete Wallet & Transactions
            const wallet = await tx.wallet.findUnique({ where: { userId: userId as string } });
            if (wallet) {
                await tx.transaction.deleteMany({ where: { walletId: wallet.id } });
                await tx.wallet.delete({ where: { id: wallet.id } });
            }

            // 8. Delete Bookings (User as customer)
            await tx.booking.deleteMany({ where: { userId: userId as string } });

            // 9. Delete Payments
            await tx.payment.deleteMany({ where: { userId: userId as string } });

            // 10. Delete Business (User as owner)
            const business = await tx.business.findUnique({ where: { ownerId: userId as string } });
            if (business) {
                await tx.booking.deleteMany({ where: { businessId: business.id } });
                await tx.business.delete({ where: { id: business.id } });
            }

            // 11. Delete Profile & related
            const profile = await tx.profile.findUnique({ where: { userId: userId as string } });
            if (profile) {
                await tx.photo.deleteMany({ where: { profileId: profile.id } });
                await tx.interest.deleteMany({ where: { profileId: profile.id } });
                await tx.preference.deleteMany({ where: { profileId: profile.id } });
                await tx.profile.delete({ where: { id: profile.id } });
            }

            // 12. Finally delete User
            await tx.user.delete({ where: { id: userId as string } });
        });

        res.json({ message: 'User and all associated data deleted permanently' });
    } catch (error: any) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: error.message || 'Error deleting user' });
    }
};

export const getAllBusinesses = async (req: Request, res: Response) => {
    try {
        const businesses = await prisma.business.findMany({
            include: {
                owner: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(businesses);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyBusiness = async (req: Request, res: Response) => {
    const { businessId } = req.params;
    const { verified } = req.body;
    try {
        const business = await prisma.business.update({
            where: { id: businessId as string },
            data: { verified }
        });
        res.json(business);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
