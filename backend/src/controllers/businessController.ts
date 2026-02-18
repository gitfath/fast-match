import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerBusiness = async (req: Request, res: Response) => {
    try {
        const { name, type, address, phone, email, openingHours, cashbackRate, description, photos } = req.body;

        const business = await prisma.business.create({
            data: {
                name,
                type,
                address,
                phone,
                email,
                openingHours,
                cashbackRate: parseFloat(cashbackRate),
                description,
                photos: JSON.stringify(photos),
                verified: false
            }
        });

        res.status(201).json(business);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const searchPlaces = async (req: Request, res: Response) => {
    try {
        const type = req.query.type as string | undefined;

        const filter: any = { verified: true };
        if (type) {
            filter.type = type;
        }

        const places = await prisma.business.findMany({
            where: filter,
            orderBy: { name: 'asc' }
        });

        res.json(places);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const getPlaceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const place = await prisma.business.findUnique({
            where: { id: id as string }
        });

        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }

        res.json(place);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const createBooking = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { businessId, matchId, date, numPeople, estimatedAmount, message } = req.body;

        const business = await prisma.business.findUnique({
            where: { id: businessId }
        });

        if (!business) {
            return res.status(404).json({ error: 'Business not found' });
        }

        const cashbackAmount = estimatedAmount ? (estimatedAmount * (business.cashbackRate / 100)) : 0;

        const booking = await prisma.booking.create({
            data: {
                userId,
                businessId,
                matchId,
                date: new Date(date),
                numPeople: parseInt(numPeople),
                estimatedAmount: parseFloat(estimatedAmount),
                cashbackAmount,
                message,
                status: 'PENDING'
            }
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const getBookings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: { business: true },
            orderBy: { date: 'desc' }
        });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const getBusinessDashboard = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const business = await prisma.business.findFirst({
            where: { ownerId: userId }
        });

        if (!business) {
            return res.status(404).json({ error: 'No business linked to this account' });
        }

        const bookings = await prisma.booking.findMany({
            where: { businessId: business.id },
            include: { user: { include: { profile: true } } },
            orderBy: { date: 'desc' }
        });

        // Basic stats
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
        const todayBookings = bookings.filter(b => {
            const today = new Date();
            const bDate = new Date(b.date);
            return bDate.getDate() === today.getDate() &&
                bDate.getMonth() === today.getMonth() &&
                bDate.getFullYear() === today.getFullYear();
        }).length;

        res.json({
            business,
            bookings,
            stats: {
                totalBookings,
                pendingBookings,
                todayBookings
            }
        });
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const booking = await prisma.booking.update({
            where: { id: id as string },
            data: { status }
        });

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};
