import type { PrismaClient } from '@prisma/client';
import { TimeOfDay } from '@prisma/client';

/**
 * Extra demo centres so the browse grid, subject filter and pagination have
 * something to show in development. Dev-only: `seed.ts` is the sole caller.
 */
const CENTERS = [
  { name: 'Aýly Gelejek', province: 'ashgabat', line: 'Parahat 4, Aşgabat', subjects: ['language', 'exam'], course: 'IELTS Preparation', price: 900, photo: 'lobby.jpg' },
  { name: 'Kompýuter Akademiýasy', province: 'ashgabat', line: 'Bitarap Türkmenistan şaýoly 22', subjects: ['it'], course: 'Web Development', price: 1200, photo: 'computer-lab.jpg' },
  { name: 'Diller Dünýäsi', province: 'ahal', line: 'Ak bugdaý etraby, Änew', subjects: ['language'], course: 'Chinese for Beginners', price: 600, photo: 'language-lab.jpg' },
  { name: 'Saz Mekany', province: 'ashgabat', line: 'Magtymguly şaýoly 108', subjects: ['music'], course: 'Piano Lessons', price: 750, photo: 'music-room.jpg' },
  { name: 'Ylham Sungat Studiýasy', province: 'balkan', line: 'Balkanabat, 203-nji kwartal', subjects: ['art'], course: 'Drawing & Painting', price: 480, photo: 'art-studio.jpg' },
  { name: 'Al-Horezmi Akademiýasy', province: 'dashoguz', line: 'Andalyp köçesi 41, Daşoguz', subjects: ['math', 'exam'], course: 'Advanced Mathematics', price: 700, photo: 'study-desk.jpg' },
  { name: 'Işewürlik Merkezi', province: 'lebap', line: 'Türkmenabat, Bitarap köçesi 9', subjects: ['business', 'language'], course: 'Business English', price: 1100, photo: 'seminar.jpg' },
  { name: 'Mary Bilim Ojagy', province: 'mary', line: 'Mary, Mollanepes köçesi 3', subjects: ['language', 'it'], course: 'Russian & Computer Basics', price: 520, photo: 'coding.jpg' },
];

export async function seedDemoCenters(
  prisma: PrismaClient,
  categoryId: string,
  passwordHash: string,
  photos: Record<string, string> = {},
) {
  for (const [i, c] of CENTERS.entries()) {
    const phone = `+9936200000${i}`;
    const owner = await prisma.user.upsert({
      where: { phone },
      update: {},
      create: {
        phone,
        passwordHash,
        name: `${c.name} eýesi`,
        role: 'OWNER',
        phoneVerified: true,
      },
    });

    const existing = await prisma.business.findUnique({
      where: { ownerId: owner.id },
    });
    if (existing) {
      await prisma.offering.deleteMany({ where: { businessId: existing.id } });
      await prisma.address.deleteMany({ where: { businessId: existing.id } });
      await prisma.business.delete({ where: { id: existing.id } });
    }

    const province = await prisma.province.findUniqueOrThrow({
      where: { slug: c.province },
    });
    const subjects = await prisma.subject.findMany({
      where: { slug: { in: c.subjects } },
    });

    await prisma.business.create({
      data: {
        ownerId: owner.id,
        categoryId,
        name: c.name,
        description: `${c.course} — ${c.name}.`,
        photos: photos[c.photo] ? [photos[c.photo]] : [],
        status: 'APPROVED',
        addresses: { create: { provinceId: province.id, line: c.line } },
        offerings: {
          create: {
            title: c.course,
            description: `${c.course} at ${c.name}.`,
            price: c.price.toFixed(2),
            prepaymentAmount: (c.price * 0.2).toFixed(2),
            subjects: { connect: subjects.map((s) => ({ id: s.id })) },
            groups: {
              create: {
                days: i % 2 === 0 ? [1, 3, 5] : [2, 4, 6],
                timeOfDay: i % 2 === 0 ? TimeOfDay.MORNING : TimeOfDay.EVENING,
                startTime: i % 2 === 0 ? '09:00' : '18:00',
                endTime: i % 2 === 0 ? '10:30' : '19:30',
                capacity: 10 + i,
              },
            },
          },
        },
      },
    });
  }
  return CENTERS.length;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * A couple of paid bookings on the owner's demo centre so the dashboard
 * overview has real revenue and a trend to show. One lands in the current
 * 30-day window and one in the previous, which is what the delta compares.
 */
export async function seedDemoBookings(
  prisma: PrismaClient,
  businessId: string,
  clientId: string,
) {
  const offering = await prisma.offering.findFirstOrThrow({
    where: { businessId },
    include: { groups: { take: 1 } },
  });
  const groupId = offering.groups[0]?.id ?? null;

  const make = async (daysAgo: number, amount: string) => {
    const at = new Date(Date.now() - daysAgo * DAY_MS);
    const booking = await prisma.booking.create({
      data: {
        clientId,
        offeringId: offering.id,
        groupId,
        status: 'CONFIRMED',
        createdAt: at,
      },
    });
    await prisma.payment.create({
      data: { bookingId: booking.id, amount, status: 'PAID', createdAt: at },
    });
  };

  await make(45, '50.00'); // previous window — the delta's baseline
  await make(3, '100.00'); // current window
}

const PENDING = [
  { name: 'Nesil Bilim Merkezi', province: 'ashgabat', line: 'Oguzhan köçesi 17', subjects: ['language'], course: 'German A1', price: 640 },
  { name: 'Kämil Akademiýa', province: 'lebap', line: 'Türkmenabat, Garaşsyzlyk 5', subjects: ['math', 'it'], course: 'Olympiad Math', price: 830 },
];

/** Centres left awaiting approval, so the admin queue isn't empty in dev. */
export async function seedPendingCenters(
  prisma: PrismaClient,
  categoryId: string,
  passwordHash: string,
) {
  for (const [i, c] of PENDING.entries()) {
    const phone = `+9936300000${i}`;
    const owner = await prisma.user.upsert({
      where: { phone },
      update: {},
      create: {
        phone,
        passwordHash,
        name: `${c.name} eýesi`,
        role: 'OWNER',
        phoneVerified: true,
      },
    });
    const existing = await prisma.business.findUnique({
      where: { ownerId: owner.id },
    });
    if (existing) {
      await prisma.offering.deleteMany({ where: { businessId: existing.id } });
      await prisma.address.deleteMany({ where: { businessId: existing.id } });
      await prisma.business.delete({ where: { id: existing.id } });
    }
    const province = await prisma.province.findUniqueOrThrow({
      where: { slug: c.province },
    });
    const subjects = await prisma.subject.findMany({
      where: { slug: { in: c.subjects } },
    });
    await prisma.business.create({
      data: {
        ownerId: owner.id,
        categoryId,
        name: c.name,
        description: `${c.course} — ${c.name}.`,
        photos: [],
        status: 'PENDING', // awaiting an admin decision
        addresses: { create: { provinceId: province.id, line: c.line } },
        offerings: {
          create: {
            title: c.course,
            description: `${c.course} at ${c.name}.`,
            price: c.price.toFixed(2),
            prepaymentAmount: (c.price * 0.2).toFixed(2),
            subjects: { connect: subjects.map((s) => ({ id: s.id })) },
          },
        },
      },
    });
  }
  return PENDING.length;
}

/**
 * Two SMS gateway phones: one beating now, one gone stale. "Online" is derived
 * from lastSeenAt vs GATEWAY_ONLINE_TTL_SEC, so a backdated row reads offline.
 */
export async function seedDemoGateways(prisma: PrismaClient) {
  const rows = [
    { phoneNumber: '+99365010101', lastSeenAt: new Date() },
    {
      phoneNumber: '+99365020202',
      lastSeenAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4h ago → offline
    },
  ];
  for (const r of rows) {
    await prisma.smsGateway.upsert({
      where: { phoneNumber: r.phoneNumber },
      update: { lastSeenAt: r.lastSeenAt },
      create: r,
    });
  }
}
