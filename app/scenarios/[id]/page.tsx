import { scenarios } from '@/data/scenarios'
import ScenarioPlayer from '@/components/ScenarioPlayer'
import { notFound } from 'next/navigation'

// Generate static params for all scenarios (required for static export)
export async function generateStaticParams() {
  return scenarios.map((scenario) => ({
    id: scenario.id,
  }))
}

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function ScenarioPage({ params }: Props) {
  const { id } = await params
  const scenario = scenarios.find(s => s.id === id)

  if (!scenario) {
    notFound()
  }

  return <ScenarioPlayer scenario={scenario} />
}

