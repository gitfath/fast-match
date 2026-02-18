import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    console.log('Clearing database...');
    await prisma.interest.deleteMany();
    await prisma.photo.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.message.deleteMany();
    await prisma.like.deleteMany();
    await prisma.match.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    const profiles = [
        {
            name: 'Afi',
            age: 24,
            gender: 'Female',
            bio: 'Passionnée de cuisine traditionnelle et de tech. Je cherche quelqu\'un de sérieux pour partager de bons moments à Lomé.',
            location: 'Lomé - Baguida',
            interests: ['Voyage', 'Musique', 'Cuisine Togolaise', 'Startup'],
            photos: ['https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=500']
        },
        {
            name: 'Koffi',
            age: 28,
            gender: 'Male',
            bio: 'Entrepreneur dans l\'agro-business. J\'aime le sport et les randonnées à Kpalimé.',
            location: 'Lomé - Adidogomé',
            interests: ['Business', 'Sport', 'Nature', 'Agriculture'],
            photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500']
        },
        {
            name: 'Amenan',
            age: 22,
            gender: 'Female',
            bio: 'Étudiante en droit, j\'adore la mode et la musique. Toujours partante pour une sortie à la plage.',
            location: 'Lomé - Kodjoviakopé',
            interests: ['Mode', 'Danse', 'Plage', 'Droit'],
            photos: ['https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=500']
        },
        {
            name: 'Komla',
            age: 30,
            gender: 'Male',
            bio: 'Ingénieur BTP, calme et posé. Je cherche une relation basée sur le respect mutuel.',
            location: 'Kara',
            interests: ['Architecture', 'Livre', 'Jazz', 'Famille'],
            photos: ['https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500']
        }
    ];

    console.log('Seeding profiles...');
    for (const p of profiles) {
        await prisma.user.create({
            data: {
                email: `${p.name.toLowerCase()}@test.com`,
                password: hashedPassword,
                profile: {
                    create: {
                        name: p.name,
                        age: p.age,
                        gender: p.gender,
                        bio: p.bio,
                        location: p.location,
                        interests: {
                            create: p.interests.map(i => ({ name: i }))
                        },
                        photos: {
                            create: p.photos.map(url => ({ url }))
                        }
                    }
                }
            }
        });
        console.log(`Created profile for ${p.name}`);
    }

    console.log('Seeding finished!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
