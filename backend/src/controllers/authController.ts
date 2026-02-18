import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
    try {
        console.log('Register payload:', { ...req.body, password: '***' });
        const { email, password, phone, role = "MEMBER" } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }
        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        console.log('Validating user existence...');
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email or phone' });
        }

        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        let user;

        if (role === 'PARTNER') {
            const { name, type, city, neighborhood, mapsUrl } = req.body;

            if (!name) return res.status(400).json({ message: 'Business name is required' });
            if (!type) return res.status(400).json({ message: 'Business type is required' });
            if (!city) return res.status(400).json({ message: 'City is required' });

            // Auto-generate Maps URL if not provided
            let finalMapsUrl = mapsUrl;
            if (!finalMapsUrl) {
                const query = `${name} ${neighborhood || ''} ${city}`.trim();
                finalMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
            }

            console.log('Creating partner user in DB...');
            user = await prisma.user.create({
                data: {
                    email,
                    phone,
                    password: hashedPassword,
                    role: 'PARTNER',
                    business: {
                        create: {
                            name,
                            type,
                            address: `${city}, ${neighborhood || ''}`, // Default address format
                            city,
                            neighborhood,
                            mapsUrl: finalMapsUrl,
                            phone,
                            email, // Use user email for business contact by default
                        }
                    }
                },
                include: {
                    business: true
                }
            });

        } else {
            // MEMBER
            const { name, birthDate, gender } = req.body;

            if (!name) return res.status(400).json({ message: 'Name is required' });
            if (!birthDate) return res.status(400).json({ message: 'Date of birth is required' });
            if (!gender) return res.status(400).json({ message: 'Gender is required' });

            // Calculate Age
            const birthDateObj = new Date(birthDate);
            if (isNaN(birthDateObj.getTime())) {
                return res.status(400).json({ message: 'Invalid birth date format' });
            }

            const today = new Date();
            let age = today.getFullYear() - birthDateObj.getFullYear();
            const m = today.getMonth() - birthDateObj.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
                age--;
            }

            if (age < 18) {
                return res.status(400).json({ message: 'You must be at least 18 years old to sign up' });
            }

            console.log('Creating user in DB...');
            user = await prisma.user.create({
                data: {
                    email,
                    phone,
                    password: hashedPassword,
                    role: 'MEMBER',
                    profile: {
                        create: {
                            name,
                            pseudo: name.split(' ')[0],
                            birthDate: birthDateObj,
                            age,
                            gender,
                            bio: `Bonjour, je suis ${name} !`
                        }
                    }
                },
                include: {
                    profile: true
                }
            });
        }

        console.log('User created:', user.id);

        console.log('Signing JWT...');
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        console.log('JWT signed');

        res.status(201).json({
            message: 'User created',
            token,
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profileId: (user as any).profile?.id,
                businessId: (user as any).business?.id
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: (error as any).message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Identifier and password are required' });
        }

        // Check if identifier is email or pseudo
        const isEmail = identifier.includes('@');

        const user = await prisma.user.findFirst({
            where: isEmail ? {
                email: identifier
            } : {
                profile: {
                    pseudo: identifier
                }
            },
            include: {
                profile: true,
                business: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profileId: user.profile?.id,
                businessId: user.business?.id
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: (error as any).message });
    }
};

// Store reset codes temporarily (in production, use Redis or database)
const resetCodes = new Map<string, { code: string; expiresAt: Date }>();

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // Don't reveal if user exists or not for security
            return res.json({ message: 'If this email exists, a reset code has been sent' });
        }

        // Generate 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Store code
        resetCodes.set(email, { code, expiresAt });

        // TODO: Send email with code
        // For now, log it to console (in production, use a real email service)
        console.log(`\n🔐 Password Reset Code for ${email}: ${code}`);
        console.log(`Code expires at: ${expiresAt.toLocaleString()}\n`);

        res.json({
            message: 'Reset code sent to your email',
            // REMOVE THIS IN PRODUCTION - only for development
            devCode: code
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: (error as any).message });
    }
};

export const verifyResetCode = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ message: 'Email and code are required' });
        }

        const storedData = resetCodes.get(email);

        if (!storedData) {
            return res.status(400).json({ message: 'No reset code found for this email' });
        }

        if (new Date() > storedData.expiresAt) {
            resetCodes.delete(email);
            return res.status(400).json({ message: 'Reset code has expired' });
        }

        if (storedData.code !== code) {
            return res.status(400).json({ message: 'Invalid reset code' });
        }

        res.json({ message: 'Code verified successfully' });
    } catch (error) {
        console.error('Verify reset code error:', error);
        res.status(500).json({ message: (error as any).message });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: 'Email, code, and new password are required' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        const storedData = resetCodes.get(email);

        if (!storedData) {
            return res.status(400).json({ message: 'No reset code found for this email' });
        }

        if (new Date() > storedData.expiresAt) {
            resetCodes.delete(email);
            return res.status(400).json({ message: 'Reset code has expired' });
        }

        if (storedData.code !== code) {
            return res.status(400).json({ message: 'Invalid reset code' });
        }

        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        // Remove used code
        resetCodes.delete(email);

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: (error as any).message });
    }
};
