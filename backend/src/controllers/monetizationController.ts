import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getBalance = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        let wallet = await prisma.wallet.findUnique({
            where: { userId }
        });

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: { userId, balanceFCFA: 0, balancePoints: 0 }
            });
        }

        res.json(wallet);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const getTransactions = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        // Check Premium
        const profile = await prisma.profile.findUnique({
            where: { userId },
            select: { isPremium: true }
        });

        if (!profile?.isPremium) {
            return res.status(403).json({ error: 'Premium required' });
        }

        const wallet = await prisma.wallet.findUnique({
            where: { userId }
        });

        if (!wallet) {
            return res.json([]);
        }

        const transactions = await prisma.transaction.findMany({
            where: { walletId: wallet.id },
            orderBy: { createdAt: 'desc' }
        });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const withdrawGains = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { amount, provider, phone } = req.body;

        // Check Premium
        const profile = await prisma.profile.findUnique({
            where: { userId },
            select: { isPremium: true }
        });

        if (!profile?.isPremium) {
            return res.status(403).json({ error: 'Premium required' });
        }

        if (amount < 5000) {
            return res.status(400).json({ error: 'Minimum withdrawal is 5000 FCFA' });
        }

        const wallet = await prisma.wallet.findUnique({
            where: { userId }
        });

        if (!wallet || wallet.balanceFCFA < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Logic for mobile money withdrawal would go here
        // For now, we just record the transaction and update the balance

        await prisma.$transaction([
            prisma.wallet.update({
                where: { id: wallet.id },
                data: { balanceFCFA: { decrement: amount } }
            }),
            prisma.transaction.create({
                data: {
                    walletId: wallet.id,
                    amount,
                    currency: 'FCFA',
                    type: 'WITHDRAW',
                    description: `Withdrawal via ${provider} to ${phone}`,
                    status: 'PENDING',
                    reference: `TX-W-${Date.now()}`
                }
            })
        ]);

        res.json({ message: 'Withdrawal request submitted' });
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const claimReferral = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { code } = req.body;

        // Check Premium
        const profile = await prisma.profile.findUnique({
            where: { userId },
            select: { isPremium: true }
        });

        if (!profile?.isPremium) {
            return res.status(403).json({ error: 'Premium required to claim bonuses' });
        }

        const referrer = await prisma.user.findUnique({
            where: { referralCode: code }
        });

        if (!referrer) {
            return res.status(404).json({ error: 'Invalid referral code' });
        }

        if (referrer.id === userId) {
            return res.status(400).json({ error: 'You cannot refer yourself' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (user?.referredById) {
            return res.status(400).json({ error: 'Referral already claimed' });
        }

        // Bonus amounts
        const REFERRER_BONUS = 500;
        const REFERRED_BONUS = 100;

        await prisma.$transaction([
            // Update User
            prisma.user.update({
                where: { id: userId },
                data: { referredById: referrer.id }
            }),
            // Referrer Wallet
            prisma.wallet.upsert({
                where: { userId: referrer.id },
                update: { balanceFCFA: { increment: REFERRER_BONUS } },
                create: { userId: referrer.id, balanceFCFA: REFERRER_BONUS }
            }),
            // Referred Wallet
            prisma.wallet.upsert({
                where: { userId },
                update: { balancePoints: { increment: REFERRED_BONUS } },
                create: { userId, balancePoints: REFERRED_BONUS }
            })
        ]);

        res.json({ message: 'Referral bonus claimed' });
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};
