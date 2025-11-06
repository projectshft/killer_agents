import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1) Create tiers
  const tiers = [
    { name: "nano" },
    { name: "micro" },
    { name: "mid" },
    { name: "macro" },
    { name: "mega" },
  ];
  const createdTiers = await Promise.all(
    tiers.map(t => prisma.tier.upsert({ where: { name: t.name }, update: {}, create: t }))
  );

  // 2) Create genres
  const genreNames = ["pop", "hiphop", "rock", "electronic", "country", "gaming", "beauty", "fitness", "comedy", "tech"];
  const createdGenres = await Promise.all(
    genreNames.map(name => prisma.genre.upsert({ where: { name }, update: {}, create: { name } }))
  );

  // helper functions for distributions
  function pick<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }
  function randomPriceForTier(tierName: string) {
    // rough, in cents
    switch (tierName) {
      case "nano": return faker.number.int({ min: 5000, max: 20000 });   // $50 - $200
      case "micro": return faker.number.int({ min: 20000, max: 100000 }); // $200 - $1,000
      case "mid": return faker.number.int({ min: 100000, max: 500000 });  // $1k - $5k
      case "macro": return faker.number.int({ min: 500000, max: 2000000 });// $5k - $20k
      case "mega": return faker.number.int({ min: 2000000, max: 10000000 });// $20k - $100k
      default: return faker.number.int({ min: 10000, max: 100000 });
    }
  }

  // 3) Create ~1000 influencers
  const TARGET = 1000;
  const created = [];
  for (let i = 0; i < TARGET; i++) {
    const name = faker.person.fullName();
    const gender = pick(["male", "female", "non-binary", null]);
    const influencer = await prisma.influencer.create({
      data: {
        name,
        gender: gender ?? undefined
      }
    });

    const tier = pick(createdTiers);
    const genre = pick(createdGenres);
    const location = `${faker.location.city()}, ${faker.location.country()}`;
    await prisma.influencerMetadata.create({
      data: {
        influencerId: influencer.id,
        tierId: tier.id,
        location,
        primaryGenreId: genre.id
      }
    });

    // one to three price points
    const numPrices = faker.number.int({ min: 1, max: 3 });
    for (let p = 0; p < numPrices; p++) {
      await prisma.price.create({
        data: {
          influencerId: influencer.id,
          priceCents: randomPriceForTier(tier.name),
          currency: "USD",
          bookingType: pick(["post", "story", "video", "package"])
        }
      });
    }

    if ((i+1) % 100 === 0) console.log(`Created ${i+1} influencers`);
  }

  console.log("Seeding complete.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
