import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.scenarioRun.create({
    data: {
      type: 'success',
      status: 'completed',
      duration: 42,
      metadata: { seeded: true },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
