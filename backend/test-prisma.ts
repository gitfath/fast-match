import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Testing Prisma connection...');
    try {
        const users = await prisma.user.findMany();
        console.log('Success! Users found:', users.length);
    } catch (error) {
        console.error('Error connecting to Prisma:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
