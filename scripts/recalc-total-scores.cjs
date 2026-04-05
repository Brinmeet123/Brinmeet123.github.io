/**
 * One-time: set User.totalScore = SUM(MAX(score) per scenario) from completed attempts.
 * Run after switching from additive totalScore to per-scenario-best sum.
 *
 *   DATABASE_URL="postgresql://..." node scripts/recalc-total-scores.cjs
 *   npx dotenv-cli -e .env.local -- node scripts/recalc-total-scores.cjs
 */

const { PrismaClient } = require('@prisma/client')

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL.')
    process.exit(1)
  }
  const prisma = new PrismaClient()
  const users = await prisma.user.findMany({ select: { id: true } })
  for (const u of users) {
    const groups = await prisma.scenarioAttempt.groupBy({
      by: ['scenarioId'],
      where: { userId: u.id, status: 'completed' },
      _max: { score: true },
    })
    const total = groups.reduce((sum, g) => sum + (g._max.score ?? 0), 0)
    await prisma.user.update({
      where: { id: u.id },
      data: { totalScore: total },
    })
    console.log(`${u.id} -> ${total}`)
  }
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
