import { Request, Response } from 'express';
import prisma from '../config/db.js';

export const createProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const {
            // Identité de base
            name, age, gender, pseudo, orientation, languages,
            // Localisation
            country, city, location, mobility, neighborhood,
            // Objectif
            relationshipGoal, openToDistance,
            // Personnalité
            personalityType, temperament, humorImportance,
            // Situation personnelle
            relationshipStatus, children, wantsChildren,
            // Études & Travail
            educationLevel, profession, jobStatus,
            // Religion & Valeurs
            religion, religiousPractice, values,
            // Apparence
            height, bodyType, style,
            // Habitudes
            smoking, drinking, sports, goingOut,
            // Confidentialité
            profileVisibility, messageSettings,
            // Autres
            bio, contactInfo,
            // Relations
            interests, photos, preferences
        } = req.body;

        const existingProfile = await prisma.profile.findUnique({ where: { userId } });
        if (existingProfile) {
            return res.status(400).json({ message: 'Profile already exists' });
        }

        const profile = await prisma.profile.create({
            data: {
                userId,
                // Identité de base
                name,
                age: parseInt(age),
                gender,
                pseudo,
                orientation,
                languages,
                // Localisation
                country,
                city,
                location,
                mobility,
                neighborhood,
                // Objectif
                relationshipGoal,
                openToDistance,
                // Personnalité
                personalityType,
                temperament,
                humorImportance,
                // Situation personnelle
                relationshipStatus,
                children,
                wantsChildren,
                // Études & Travail
                educationLevel,
                profession,
                jobStatus,
                // Religion & Valeurs
                religion,
                religiousPractice,
                values,
                // Apparence
                height,
                bodyType,
                style,
                // Habitudes
                smoking,
                drinking,
                sports,
                goingOut,
                // Confidentialité
                profileVisibility,
                messageSettings,
                // Autres
                bio,
                contactInfo,
                // Relations
                interests: {
                    create: (interests || []).map((i: string) => ({ name: i }))
                },
                photos: {
                    create: (photos || []).map((p: string) => ({ url: p }))
                },
                preferences: preferences ? {
                    create: {
                        minAge: preferences?.minAge || 18,
                        maxAge: preferences?.maxAge || 50,
                        gender: preferences?.gender || 'Tout',
                        distance: preferences?.distance || 50,
                        // Autres préférences
                        relationshipGoal: preferences?.relationshipGoal,
                        openToDistance: preferences?.openToDistance,
                        personalityType: preferences?.personalityType,
                        relationshipStatus: preferences?.relationshipStatus,
                        children: preferences?.children,
                        wantsChildren: preferences?.wantsChildren,
                        minEducationLevel: preferences?.minEducationLevel,
                        religion: preferences?.religion,
                        smoking: preferences?.smoking,
                        drinking: preferences?.drinking
                    }
                } : undefined
            },
            include: {
                interests: true,
                photos: true,
                preferences: true
            }
        });

        res.status(201).json(profile);
    } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).json({ error: (error as any).message });
    }
};

export const getMyProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const profile = await prisma.profile.findUnique({
            where: { userId },
            include: {
                interests: true,
                photos: true,
                preferences: true,
                user: {
                    select: {
                        email: true,
                        phone: true
                    }
                }
            }
        });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        console.log(`Updating profile for user: ${userId}`);

        const {
            // Identité de base
            name, age, birthDate, gender, pseudo, orientation, languages,
            // Localisation
            country, city, location, mobility, neighborhood,
            // Objectif
            relationshipGoal, openToDistance,
            // Personnalité
            personalityType, temperament, humorImportance,
            // Situation personnelle
            relationshipStatus, children, wantsChildren,
            // Études & Travail
            educationLevel, profession, jobStatus,
            // Religion & Valeurs
            religion, religiousPractice, values,
            // Apparence
            height, bodyType, style,
            // Habitudes
            smoking, drinking, sports, goingOut,
            // Confidentialité
            profileVisibility, messageSettings,
            // Autres
            bio, contactInfo,
            // Relations
            interests, photos, preferences
        } = req.body;

        const data: any = {
            // Identité de base
            name,
            birthDate: birthDate ? new Date(birthDate) : undefined,
            gender,
            pseudo,
            orientation,
            languages,
            // Localisation
            country,
            city,
            location,
            mobility,
            neighborhood,
            // Objectif
            relationshipGoal,
            openToDistance,
            // Personnalité
            personalityType,
            temperament,
            humorImportance,
            // Situation personnelle
            relationshipStatus,
            children,
            wantsChildren,
            // Études & Travail
            educationLevel,
            profession,
            jobStatus,
            // Religion & Valeurs
            religion,
            religiousPractice,
            values,
            // Apparence
            height,
            bodyType,
            style,
            // Habitudes
            smoking,
            drinking,
            sports,
            goingOut,
            // Confidentialité
            profileVisibility,
            messageSettings,
            bio,
            contactInfo
        };

        // Generate Referral Code logic if name and birthdate are present/updated
        const user = await prisma.user.findUnique({ where: { id: userId } });

        // Check if we have name and birthdate available (either in update or existing profile)
        // Note: birthDate handling needs care as it might be in different formats or not present in req.body
        // The user request specified "prenom + jour + mois". 
        // We will try to generate it if the user doesn't have one yet.

        if (user && !user.referralCode && name) {
            // Basic logic: Take first word of name, uppercase it.
            // We need birth day/month. req.body.birthDate isn't consistently passed in updateProfile in previous code.
            // We'll rely on what's passed or try to parse it if available.
            // Assuming 'age' is passed but not birthDate. 
            // If birthDate is not available, we CANNOT fulfill "jour et mois".
            // However, let's assume if birthDate is part of the 'data' we can use it.
            // Looking at schema, birthDate is on Profile.

            // If birthDate is provided in body:
            // const bDate = req.body.birthDate ? new Date(req.body.birthDate) : null;

            // Since the previous implementation didn't explicitly handle 'birthDate' in req.body destructuring 
            // (it just had 'age'), we might need to look for it if the frontend sends it.
            // Let's check if 'birthDate' is in req.body

            const bDateStr = req.body.birthDate;
            if (bDateStr) {
                const bDate = new Date(bDateStr);
                if (!isNaN(bDate.getTime())) {
                    const firstName = name.trim().split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '');
                    const day = String(bDate.getDate()).padStart(2, '0');
                    const month = String(bDate.getMonth() + 1).padStart(2, '0');
                    const newCode = `${firstName}${day}${month}`;

                    // Check uniqueness (simple check, if taken we might append random, but user asked for specific format)
                    // We will Try to set it. If it fails due to unique constraint, we might need a fallback.
                    // For now, let's try to update the user.

                    try {
                        await prisma.user.update({
                            where: { id: userId },
                            data: { referralCode: newCode }
                        });
                    } catch (e) {
                        console.log("Referral code generation failed (probably duplicate):", newCode);
                    }
                }
            }
        }

        if (age) data.age = parseInt(age);

        const profile = await prisma.profile.update({
            where: { userId },
            data: {
                ...data,
                interests: interests ? {
                    deleteMany: {},
                    create: interests.map((i: string) => ({ name: i }))
                } : undefined,
                photos: photos ? {
                    deleteMany: {},
                    create: photos.map((p: string) => ({ url: p }))
                } : undefined,
                preferences: preferences ? {
                    upsert: {
                        create: {
                            minAge: parseInt(preferences.minAge) || 18,
                            maxAge: parseInt(preferences.maxAge) || 50,
                            gender: preferences.gender || 'Tout',
                            distance: parseInt(preferences.distance) || 50,
                            // Autres préférences
                            relationshipGoal: preferences.relationshipGoal,
                            openToDistance: preferences.openToDistance,
                            personalityType: preferences.personalityType,
                            relationshipStatus: preferences.relationshipStatus,
                            children: preferences.children,
                            wantsChildren: preferences.wantsChildren,
                            minEducationLevel: preferences.minEducationLevel,
                            religion: preferences.religion,
                            smoking: preferences.smoking,
                            drinking: preferences.drinking,
                            sports: preferences.sports,
                            bodyType: preferences.bodyType,
                            heightRange: preferences.heightRange,
                            jobStatus: preferences.jobStatus,
                            religiousPractice: preferences.religiousPractice
                        },
                        update: {
                            minAge: parseInt(preferences.minAge) || 18,
                            maxAge: parseInt(preferences.maxAge) || 50,
                            gender: preferences.gender || 'Tout',
                            distance: parseInt(preferences.distance) || 50,
                            // Autres préférences
                            relationshipGoal: preferences.relationshipGoal,
                            openToDistance: preferences.openToDistance,
                            personalityType: preferences.personalityType,
                            relationshipStatus: preferences.relationshipStatus,
                            children: preferences.children,
                            wantsChildren: preferences.wantsChildren,
                            minEducationLevel: preferences.minEducationLevel,
                            religion: preferences.religion,
                            smoking: preferences.smoking,
                            drinking: preferences.drinking,
                            sports: preferences.sports,
                            bodyType: preferences.bodyType,
                            heightRange: preferences.heightRange,
                            jobStatus: preferences.jobStatus,
                            religiousPractice: preferences.religiousPractice
                        }
                    }
                } : undefined
            },
            include: {
                interests: true,
                photos: true,
                preferences: true
            }
        });

        res.json(profile);
    } catch (error: any) {
        console.error("Error updating profile:", error);
        console.error("Error details:", error.message, error.stack);
        res.status(500).json({
            message: 'Erreur lors de la mise à jour du profil',
            error: error.message
        });
    }
};

export const deleteProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        console.log(`Deleting profile (soft delete) for user: ${userId}`);

        // Soft delete: Anonymize and mark as deleted
        // We delete interests, photos, preferences immediately.
        await prisma.profile.update({
            where: { userId },
            data: {
                name: 'Utilisateur Supprimé',
                pseudo: null,
                bio: null,
                photos: { deleteMany: {} },
                interests: { deleteMany: {} },
                preferences: { delete: true },
                accountStatus: 'Deleted',
                profileVisibility: 'Private',
                messageSettings: 'Personne',
                phoneVerified: false,
                idVerified: false,
                isPremium: false,
                isBoosted: false,
                birthDate: null,
                location: null,
                contactInfo: null
            }
        });

        res.json({ message: 'Compte supprimé avec succès' });
    } catch (error: any) {
        console.error("Error deleting profile:", error);

        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Profil introuvable' });
        }

        res.status(500).json({
            message: 'Erreur lors de la suppression du profil',
            error: error.message
        });
    }
};
