import { PrismaClient, Role, TimeOfDay } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import {
  seedDemoBookings,
  seedDemoCenters,
  seedDemoGateways,
  seedPendingCenters,
} from './demo-centers';
import { seedDemoPhotos } from './demo-photos';

const prisma = new PrismaClient();

async function main() {
  // --- Categories: education only for now. Future categories (car wash,
  // barber…) will get their own domain tables, not the course/group model.
  const education = await prisma.category.upsert({
    where: { slug: 'education' },
    update: {},
    create: { name: 'Education Centers', slug: 'education' },
  });

  // --- Test users (password: "password123") ---
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { phone: '+99360000000' },
    update: { role: Role.ADMIN },
    create: {
      phone: '+99360000000',
      passwordHash,
      name: 'Bellet Admin',
      role: Role.ADMIN,
      phoneVerified: true,
    },
  });
  const owner = await prisma.user.upsert({
    where: { phone: '+99361000000' },
    update: {},
    create: {
      phone: '+99361000000',
      passwordHash,
      name: 'Test Owner',
      role: Role.OWNER,
      phoneVerified: true,
    },
  });
  await prisma.user.upsert({
    where: { phone: '+99361111111' },
    update: {},
    create: {
      phone: '+99361111111',
      passwordHash,
      name: 'Test Client',
      role: Role.CLIENT,
      phoneVerified: true,
    },
  });

  // --- Sample center with teachers, courses, and groups (one per owner) ---
  // Demo cover art, self-hosted in MinIO like a real owner upload would be.
  const photos = await seedDemoPhotos();

  const provinces = await prisma.province.findMany();
  const provinceBySlug = (slug: string) =>
    provinces.find((p) => p.slug === slug) ?? provinces[0];

  let business = await prisma.business.findUnique({
    where: { ownerId: owner.id },
  });
  if (!business) {
    business = await prisma.business.create({
      data: {
        ownerId: owner.id,
        categoryId: education.id,
        name: 'Ylym Bilim Merkezi',
        description:
          'A leading education center offering language and IT courses.',
        photos: [photos['classroom.jpg'], photos['lobby.jpg']],
        status: 'APPROVED',
      },
    });
  } else {
    // Keep the demo center publicly visible, and refresh its cover art.
    business = await prisma.business.update({
      where: { id: business.id },
      data: {
        status: 'APPROVED',
        photos: [photos['classroom.jpg'], photos['lobby.jpg']],
      },
    });
  }

  // Clear existing sample courses/teachers/addresses so the seed is safely repeatable.
  await prisma.booking.deleteMany({
    where: { offering: { businessId: business.id } },
  });
  await prisma.offering.deleteMany({ where: { businessId: business.id } });
  await prisma.teacher.deleteMany({ where: { businessId: business.id } });
  await prisma.address.deleteMany({ where: { businessId: business.id } });

  // Three buildings in different welayats — shows the multi-address UI.
  const [mainAddress, branchAddress, thirdAddress] = await Promise.all([
    prisma.address.create({
      data: {
        businessId: business.id,
        provinceId: provinceBySlug('ashgabat').id,
        line: 'Görogly köçesi 45, Aşgabat',
      },
    }),
    prisma.address.create({
      data: {
        businessId: business.id,
        provinceId: provinceBySlug('mary').id,
        line: 'Magtymguly şaýoly 12, Mary',
      },
    }),
    prisma.address.create({
      data: {
        businessId: business.id,
        provinceId: provinceBySlug('dashoguz').id,
        line: 'Andalyp köçesi 8, Daşoguz',
      },
    }),
  ]);
  const addresses = [mainAddress, branchAddress, thirdAddress];

  // Subjects are seeded by the migration; wire the demo courses to them so the
  // browse sidebar filter has something real to match.
  const subject = async (slug: string) =>
    (await prisma.subject.findUniqueOrThrow({ where: { slug } })).id;
  const [language, it, math, exam] = await Promise.all(
    ['language', 'it', 'math', 'exam'].map(subject),
  );
  const randomAddressId = () =>
    addresses[Math.floor(Math.random() * addresses.length)].id;

  const merjen = await prisma.teacher.create({
    data: {
      businessId: business.id,
      name: 'Merjen Amanowa',
      bio: 'English teacher, 10 years of experience.',
    },
  });
  const serdar = await prisma.teacher.create({
    data: {
      businessId: business.id,
      name: 'Serdar Myradow',
      bio: 'English & IELTS instructor.',
    },
  });
  const aina = await prisma.teacher.create({
    data: {
      businessId: business.id,
      name: 'Aýna Gurbanowa',
      bio: 'Russian & Math teacher.',
    },
  });

  // English — two groups (Mon/Wed/Fri morning; Tue/Thu/Sat evening)
  await prisma.offering.create({
    data: {
      businessId: business.id,
      title: 'English for Beginners',
      description: 'A2 level English course, 3 months.',
      price: '500.00',
      prepaymentAmount: '100.00',
      subjects: { connect: [{ id: language }, { id: exam }] },
      groups: {
        create: [
          {
            teacherId: merjen.id,
            addressId: randomAddressId(),
            days: [1, 3, 5],
            timeOfDay: TimeOfDay.MORNING,
            startTime: '09:00',
            endTime: '10:30',
            capacity: 15,
          },
          {
            teacherId: serdar.id,
            addressId: randomAddressId(),
            days: [2, 4, 6],
            timeOfDay: TimeOfDay.EVENING,
            startTime: '18:00',
            endTime: '19:30',
            capacity: 12,
          },
        ],
      },
    },
  });

  // Russian — one group
  await prisma.offering.create({
    data: {
      businessId: business.id,
      title: 'Russian Language',
      description: 'Conversational Russian, all levels.',
      price: '450.00',
      prepaymentAmount: '90.00',
      subjects: { connect: [{ id: language }] },
      groups: {
        create: [
          {
            teacherId: aina.id,
            addressId: randomAddressId(),
            days: [1, 3, 5],
            timeOfDay: TimeOfDay.AFTERNOON,
            startTime: '14:00',
            endTime: '15:30',
            capacity: 10,
          },
        ],
      },
    },
  });

  // Mathematics — one group
  await prisma.offering.create({
    data: {
      businessId: business.id,
      title: 'Mathematics',
      description: 'School mathematics, exam preparation.',
      price: '400.00',
      prepaymentAmount: '80.00',
      subjects: { connect: [{ id: math }, { id: exam }, { id: it }] },
      groups: {
        create: [
          {
            teacherId: aina.id,
            addressId: randomAddressId(),
            days: [2, 4, 6],
            timeOfDay: TimeOfDay.MORNING,
            startTime: '10:00',
            endTime: '11:30',
            capacity: 20,
          },
        ],
      },
    },
  });

  const demoCount = await seedDemoCenters(
    prisma,
    education.id,
    passwordHash,
    photos,
  );

  const pendingCount = await seedPendingCenters(
    prisma,
    education.id,
    passwordHash,
  );
  await seedDemoGateways(prisma);

  const testClient = await prisma.user.findUniqueOrThrow({
    where: { phone: '+99361111111' },
  });
  await seedDemoBookings(prisma, business.id, testClient.id);

  console.log('Seed complete:', {
    owner: owner.phone,
    business: business.name,
    courses: ['English for Beginners', 'Russian Language', 'Mathematics'],
    extraDemoCenters: demoCount,
    pendingCenters: pendingCount,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
