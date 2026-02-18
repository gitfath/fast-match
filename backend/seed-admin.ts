
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const adminPseudo = 'adminfath.007';
    const adminPassword = '87654321';
    const adminEmail = 'admin@fast-match.com';
    const adminPhone = '+22800000000';

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
        where: {
            profile: {
                pseudo: adminPseudo
            }
        }
    });

    if (existingAdmin) {
        console.log(`Admin user '${adminPseudo}' already exists.`);

        // Optional: Update password if it exists to ensure we can login
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await prisma.user.update({
            where: { id: existingAdmin.id },
            data: {
                password: hashedPassword,
                role: 'ADMIN' // Ensure role is ADMIN
            }
        });
        console.log(`Admin password and role updated.`);
        return;
    }

    // Create Admin
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            phone: adminPhone,
            password: hashedPassword,
            role: 'ADMIN',
            profile: {
                create: {
                    name: 'Super Admin',
                    pseudo: adminPseudo,
                    age: 30,
                    gender: 'Autre',
                    bio: 'Administrator account',
                    country: 'Togo',
                    city: 'Lomé',
                    verified: true,
                    accountStatus: 'Actif',
                    profileVisibility: 'Privé'
                }
            }
        }
    });

    console.log(`Admin user '${adminPseudo}' created successfully.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
