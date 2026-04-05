import Link from 'next/link'
import { redirect } from 'next/navigation'
import NextStepGuidance from '@/components/ux/NextStepGuidance'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { scoreToLevel } from '@/lib/scoring'
import { scenarios } from '@/data/scenarios'
import { countDistinctCompletedScenarios, getScenarioSummariesForUser } from '@/lib/scenarioMastery'

function performanceLevelFromCompleted(avgScore: number, completedCount: number): string {
  if (completedCount === 0) return 'Building foundation'
  return scoreToLevel(avgScore)
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/dashboard')
  }

  const scenarioIds = scenarios.map((s) => s.id)

  const [user, scenariosCompleted, summaries] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        _count: { select: { vocab: true } },
      },
    }),
    countDistinctCompletedScenarios(session.user.id),
    getScenarioSummariesForUser(session.user.id, scenarioIds),
  ])

  const completedSummaries = scenarioIds
    .map((id) => summaries.get(id)!)
    .filter((s) => s.displayStatus === 'completed')
  const avgScore =
    completedSummaries.length > 0
      ? completedSummaries.reduce((acc, s) => acc + (s.bestScore ?? 0), 0) / completedSummaries.length
      : 0

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-slate-600">User profile not found.</p>
        <Link href="/login" className="text-teal-700 hover:underline mt-4 inline-block">
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <p className="text-sm font-semibold text-teal-800 mb-1">Your learning hub</p>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Track Your Progress</h1>
      <p className="text-slate-600 mb-2">See completed cases, scores, and where to drill next.</p>
      <p className="text-sm text-slate-500 mb-6">Open any scenario below to resume or replay — your best scores stay on record.</p>
      <div className="mb-8 max-w-lg">
        <NextStepGuidance compact>
          Ask a few more questions — then head to the exam when you feel ready.
        </NextStepGuidance>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-teal-800 uppercase tracking-wide mb-4">Profile</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-slate-500">Name</dt>
              <dd className="text-slate-900 font-medium">{user.name ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Username</dt>
              <dd className="text-slate-900 font-medium">@{user.username}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Email</dt>
              <dd className="text-slate-900 font-medium">{user.email}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Email updates</dt>
              <dd className="text-slate-900 font-medium">{user.subscribed ? 'Subscribed' : 'Opted out'}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-teal-800 uppercase tracking-wide mb-4">Performance</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-slate-500">Total score</dt>
              <dd className="text-3xl font-bold text-slate-900">{user.totalScore}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Performance level</dt>
              <dd className="text-slate-900 font-medium">
                {performanceLevelFromCompleted(avgScore, scenariosCompleted)}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Scenarios completed</dt>
              <dd className="text-slate-900 font-medium">{scenariosCompleted}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Saved vocabulary</dt>
              <dd className="text-slate-900 font-medium">{user._count.vocab} terms</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-semibold text-teal-800 uppercase tracking-wide mb-4">Scenario progress</h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
          {scenarios.map((s) => {
            const sum = summaries.get(s.id)!
            let label = 'Not started'
            let detail = ''
            if (sum.displayStatus === 'in_progress') {
              label = 'In progress'
              detail = [
                sum.bestScore != null ? `Best ${sum.bestScore}` : '',
                sum.lastAttemptScore != null ? `Last ${sum.lastAttemptScore}` : '',
              ]
                .filter(Boolean)
                .join(' · ')
            } else if (sum.displayStatus === 'completed') {
              label = 'Done'
              detail = [
                sum.bestScore != null ? `Best ${sum.bestScore}` : '',
                sum.lastAttemptScore != null ? `Last ${sum.lastAttemptScore}` : '',
              ]
                .filter(Boolean)
                .join(' · ')
            }
            return (
              <Link
                key={s.id}
                href={`/scenarios/${s.id}`}
                className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-slate-50 transition text-sm"
              >
                <span className="font-medium text-slate-900">{s.title}</span>
                <span className="shrink-0 text-slate-600 tabular-nums">
                  <span className="mr-2">{label}</span>
                  {detail ? <span className="text-slate-500">{detail}</span> : null}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/scenarios"
          className="btn-press inline-flex items-center rounded-lg bg-teal-700 text-white px-5 py-2.5 text-sm font-semibold hover:bg-teal-800 transition"
        >
          Open case library
        </Link>
        <Link href="/vocab" className="btn-press inline-flex items-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition">
          Review vocabulary
        </Link>
      </div>
    </div>
  )
}
