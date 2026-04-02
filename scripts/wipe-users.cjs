/**
 * One-time / maintenance: delete all users (and cascaded Vocab + ScenarioProgress).
 *
 * Usage (Neon / any Postgres URL):
 *   DATABASE_URL="postgresql://..." node scripts/wipe-users.cjs
 *
 * If DATABASE_URL is in .env.local:
 *   npx dotenv-cli -e .env.local -- node scripts/wipe-users.cjs
 */

const { PrismaClient } = require('@prisma/client')

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL. Example: DATABASE_URL="postgresql://..." node scripts/wipe-users.cjs')
    process.exit(1)
  }
  const prisma = new PrismaClient()
  const result = await prisma.user.deleteMany()
  console.log(`Deleted ${result.count} user(s). Related vocab and scenario progress were removed (cascade).`)
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
