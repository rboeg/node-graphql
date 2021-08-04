const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.ple' },
    update: {},
    create: {
      email: 'alice@example.ple',
      password: 'pass2021.not.secure',
      firstName: 'Alice',
      lastName: 'Willson',
      isLandlord: true,
      apartments: {
        create: {
          title: 'Comfortable Studio',
          description: 'Studio in Berlin, Karlshorst',
          monthlyRentEUR: 1420,
          latitude: 52.48470974603695, 
          longitude: 13.524449900914442,
          city: 'Berlin',
          nBedrooms: 1,
          nBathrooms: 1,
          areaM2: 25
        },
      },
    },
  });

  const peter = await prisma.user.upsert({
    where: { email: 'peter@example.ple' },
    update: {},
    create: {
      email: 'peter@example.ple',
      password: 'pass2021.not.secure',
      firstName: 'Peter',
      lastName: 'Gallsbou',
      isLandlord: true,
      apartments: {
        create: {
          title: '3-room apartment in Hellersdorf',
          description: 'Bright and quiet apartment with 2 bedrooms.',
          monthlyRentEUR: 3200,
          latitude: 52.54070481230224,
          longitude: 13.597487228938814,
          city: 'Berlin',
          nBedrooms: 2,
          nBathrooms: 1,
          areaM2: 49
        },
      },
    },
  });

  const lucia = await prisma.user.upsert({
    where: { email: 'lucia@example.ple' },
    update: {},
    create: {
      email: 'lucia@example.ple',
      password: 'pass2021.not.secure',
      firstName: 'Lucia',
      lastName: 'Multairs',
      isLandlord: true,
      apartments: {
        create: {
          title: 'Four-room apartment in the countryside',
          description: 'Newly renovated and completely furnished apartment on 78 sqm.',
          monthlyRentEUR: 2350,
          latitude: 51.07207569695171,
          longitude: 7.126750531156095,
          city: 'Cologne',
          nBedrooms: 3,
          nBathrooms: 2,
          areaM2: 78
        },
      },
    },
  });

  console.log({ alice, peter, lucia})
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })