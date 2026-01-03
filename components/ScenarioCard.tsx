import Link from 'next/link'
import { Scenario, ScenarioDifficulty } from '@/data/scenarios'

type Props = {
  scenario: Scenario
}

const difficultyColors: Record<ScenarioDifficulty, string> = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
}

export default function ScenarioCard({ scenario }: Props) {
  return (
    <Link href={`/scenarios/${scenario.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 h-full flex flex-col cursor-pointer border border-gray-200">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900">{scenario.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[scenario.difficulty]}`}>
            {scenario.difficulty}
          </span>
        </div>
        <div className="mb-3">
          <span className="text-sm text-primary-600 font-medium">{scenario.specialty}</span>
          <span className="text-sm text-gray-500 mx-2">•</span>
          <span className="text-sm text-gray-500">{scenario.estimatedMinutes} min</span>
        </div>
        <p className="text-gray-600 text-sm flex-grow mb-4">{scenario.description}</p>
        <div className="flex items-center text-primary-600 text-sm font-medium">
          Start Scenario →
        </div>
      </div>
    </Link>
  )
}

