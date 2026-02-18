import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

const PAYGATE_API_URL = 'https://paygateglobal.com/api/v1/page';
const PAYGATE_AUTH_TOKEN = process.env.PAYGATE_AUTH_TOKEN || 'YOUR_PAYGATE_TOKEN';

export const initiatePayment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { amount, description, phoneNumber, network } = req.body;

        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }

        // 1. Create local transaction record
        const payment = await prisma.payment.create({
            data: {
                userId,
                amount: parseFloat(amount),
                provider: network || 'PAYGATE',
                status: 'PENDING',
                description: description || 'Payment via PayGate',
            }
        });

        // 2. Prepare PayGate Payload
        const payload = {
            auth_token: PAYGATE_AUTH_TOKEN,
            phone_number: phoneNumber,
            amount: parseFloat(amount),
            description: description || `Payment #${payment.id}`,
            identifier: payment.id,
            network: network // Optional: 'TMONEY', 'FLOOZ', or 'CARD'
        };

        console.log(`Initiating PayGate payment for ${payment.id}:`, payload);

        const response = await fetch(PAYGATE_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data: any = await response.json();
        console.log('PayGate Response:', data);

        if (!response.ok || (data.status !== 0 && data.status !== 2)) {
            // DEV MODE FALLBACK
            if (process.env.NODE_ENV !== 'production' && !process.env.PAYGATE_AUTH_TOKEN) {
                console.warn("Using DEV fallback for PayGate URL (No valid token)");
                return res.json({
                    paymentId: payment.id,
                    paymentUrl: `https://paygateglobal.com/v1/page?token=SIMULATED&amount=${amount}&description=${encodeURIComponent(description || '')}&identifier=${payment.id}`,
                    txReference: `SIM-${Date.now()}`
                });
            }
            return res.status(400).json({ error: 'PayGate Error', details: data });
        }

        if (data.tx_reference) {
            await prisma.payment.update({
                where: { id: payment.id },
                data: { reference: data.tx_reference }
            });
        }

        res.json({
            paymentId: payment.id,
            paymentUrl: data.payment_url || data.url,
            txReference: data.tx_reference
        });

    } catch (error) {
        console.error('Payment initiation error:', error);
        res.status(500).json({ error: (error as any).message });
    }
};

export const handleCallback = async (req: Request, res: Response) => {
    try {
        const { tx_reference, identifier, status } = req.body;
        console.log('PayGate Callback Received:', req.body);

        if (!identifier) {
            return res.status(400).json({ error: 'Missing identifier' });
        }

        let newStatus = 'PENDING';
        if (String(status) === '0') newStatus = 'COMPLETED';
        else if (String(status) === '4' || String(status) === '6') newStatus = 'FAILED';

        await prisma.payment.update({
            where: { id: identifier },
            data: {
                status: newStatus,
                reference: tx_reference
            }
        });

        if (newStatus === 'COMPLETED') {
            const payment = await prisma.payment.findUnique({ where: { id: identifier } });
            if (payment) {
                await prisma.profile.update({
                    where: { userId: payment.userId },
                    data: { isPremium: true }
                });
                console.log(`Premium activated for user ${payment.userId}`);
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Callback error:', error);
        res.status(500).json({ error: (error as any).message });
    }
};

export const getPaymentHistory = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const history = await prisma.payment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const checkPaymentStatus = async (req: Request, res: Response) => {
    try {
        const identifier = req.params.identifier as string;
        const payment = await prisma.payment.findUnique({
            where: { id: identifier }
        });

        if (!payment) return res.status(404).json({ error: 'Payment not found' });
        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};
