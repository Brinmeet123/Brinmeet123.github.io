'use client'

import Link from 'next/link'
import { Scenario } from '@/data/scenarios'
import type { RubricBreakdown } from '@/lib/scoring'
import VocabText from './VocabText'
import VocabContextBlock from './VocabContextBlock'
import { vocab, getVocabTerm } from '@/data/vocab'
import NextStepGuidance from './ux/NextStepGuidance'

type DebriefStructured = {
  summary: string
  strengths: string[]
  missedOpportunities: string[]
  diagnosticReasoning: string[]
  nextStepAdvice: string[]
  clinicalPearls: string[]
  vocabToReview: string[]
}

type AssessmentResult = {
  overallRating: string
  summary: string
  strengths: string[]
  areasForImprovement: string[]
  diagnosisFeedback: string
  missedKeyHistoryPoints: string[]
  testSelectionFeedback: string
  sectionRatings?: {
    history?: string
    exam?: string
    tests?: string
    diagnosis?: string
    communication?: string
  }
  totalScore?: number
  totalScorePercentage?: number
  maxScore?: number
  scoreBreakdown?: {
    history?: number
    exam?: number
    tests?: number
    diagnosis?: number
    communication?: number
  }
  /** Deterministic debrief engine */
  debriefStructured?: DebriefStructured
  source?: string
}

type Props = {
  scenario: Scenario
  assessment: AssessmentResult
  clickedTerms?: string[]
  savedTerms?: string[]
  onTermClick?: (term: string) => void
  onTermSave?: (term: string) => void
  /** Deterministic rubric from scenario completion scoring */
  scenarioScore?: {
    score: number
    level: string
    feedback: string
    rubric: RubricBreakdown
  }
}

const ratingColors: Record<string, string> = {
  Excellent: 'bg-green-100 text-green-800 border-green-300',
  Good: 'bg-blue-100 text-blue-800 border-blue-300',
  'Needs Improvement': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Poor: 'bg-red-100 text-red-800 border-red-300',
}

function RubricBlock({
  rubric,
  score,
  level,
  feedback,
}: {
  rubric: RubricBreakdown
  score: number
  level: string
  feedback: string
}) {
  const rows: { label: string; value: number; max: number }[] = [
    { label: 'Diagnosis', value: rubric.diagnosis, max: 40 },
    { label: 'Questioning', value: rubric.questioning, max: 25 },
    { label: 'Reasoning', value: rubric.reasoning, max: 25 },
    { label: 'Efficiency', value: rubric.efficiency, max: 10 },
  ]
  return (
    <div className="mb-6 p-5 bg-gradient-to-br from-teal-50 to-slate-50 rounded-xl border border-teal-200 shadow-sm">
      <h3 className="text-lg font-semibold text-teal-900 mb-2">Your score</h3>
      <p className="text-4xl font-bold text-slate-900 tabular-nums transition-all duration-500 ease-out">
        {score}
        <span className="text-2xl font-semibold text-slate-600">/100</span>
      </p>
      <p className="text-sm font-medium text-teal-900 mt-1">{level}</p>
      <p className="text-sm text-slate-700 mt-2 leading-relaxed">{feedback}</p>
      <p className="text-xs text-slate-500 mt-4 mb-3">Weighted rubric breakdown</p>
      <h4 className="text-sm font-semibold text-slate-800 mb-2">Breakdown</h4>
      <ul className="space-y-1.5 text-sm text-slate-700">
        {rows.map((r) => (
          <li key={r.label} className="flex justify-between gap-4 tabular-nums">
            <span>{r.label}</span>
            <span>
              {r.value}/{r.max}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SummaryPanel({
  scenario,
  assessment,
  clickedTerms = [],
  savedTerms = [],
  onTermClick,
  onTermSave,
  scenarioScore,
}: Props) {
  // Calculate badges based on behavior
  const badges: string[] = []
  
  // History Builder - asked about key areas
  if (assessment.strengths.some(s => s.toLowerCase().includes('history') || s.toLowerCase().includes('interview'))) {
    badges.push('History Builder')
  }
  
  // Red Flag Spotter - identified red flags
  if (assessment.strengths.some(s => s.toLowerCase().includes('red flag') || s.toLowerCase().includes('urgent'))) {
    badges.push('Red Flag Spotter')
  }
  
  // Smart Test Picker - ordered appropriate tests
  if (assessment.strengths.some(s => s.toLowerCase().includes('test') || s.toLowerCase().includes('diagnostic'))) {
    badges.push('Smart Test Picker')
  }
  
  // Differential Thinker - good differential diagnosis
  if (assessment.strengths.some(s => s.toLowerCase().includes('differential') || s.toLowerCase().includes('diagnosis'))) {
    badges.push('Differential Thinker')
  }
  
  // Clear Communicator - good communication
  if (assessment.strengths.some(s => s.toLowerCase().includes('communication') || s.toLowerCase().includes('rapport'))) {
    badges.push('Clear Communicator')
  }
  
  // New Terms Learned
  const newTermsCount = clickedTerms.length
  
  // Get recommended terms to review (from missed points or important terms in scenario)
  const recommendedTerms = vocab
    .filter(term => {
      // Terms related to missed history points
      const relatedToMissed = assessment.missedKeyHistoryPoints.some(point => 
        point.toLowerCase().includes(term.term.toLowerCase()) ||
        term.tags.some(tag => point.toLowerCase().includes(tag))
      )
      // Important terms for this scenario type
      const isImportant = term.tags.includes('red-flag') || term.tags.includes('cardiac')
      return (relatedToMissed || isImportant) && !savedTerms.includes(term.term)
    })
    .slice(0, 5)
    .map(term => term.term)

  const ds = assessment.debriefStructured
  const debriefContext =
    `${assessment.summary}\n${assessment.strengths.join('\n')}\n${assessment.areasForImprovement.join('\n')}\n${assessment.diagnosisFeedback}\n${assessment.testSelectionFeedback}\n${scenario.teachingPoints.join('\n')}${ds ? `\n${ds.nextStepAdvice.join('\n')}\n${ds.clinicalPearls.join('\n')}` : ''}`

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <VocabContextBlock source="debrief" scenarioId={scenario.id} text={debriefContext}>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">📊 Your Diagnosis Report</h2>
      <p className="mb-6 text-sm text-slate-600 leading-relaxed">
        Here&apos;s how this run scored, what you nailed, what to tighten, and what to take forward.
      </p>

      {scenarioScore && (
        <RubricBlock
          rubric={scenarioScore.rubric}
          score={scenarioScore.score}
          level={scenarioScore.level}
          feedback={scenarioScore.feedback}
        />
      )}

      {!scenarioScore && assessment.totalScore != null && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Your score</h3>
          <p className="text-3xl font-bold text-slate-900 tabular-nums">
            {assessment.totalScore}
            <span className="text-xl font-semibold text-slate-600">/{assessment.maxScore ?? 100}</span>
          </p>
          {assessment.totalScorePercentage != null && (
            <p className="text-sm text-slate-600 mt-1">{assessment.totalScorePercentage}% overall</p>
          )}
        </div>
      )}
      
      {/* Badges Section */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border-2 border-primary-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Badges</h3>
        {badges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-primary-600 text-white rounded-full text-sm font-medium shadow-sm"
              >
                {badge}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">None this run.</p>
        )}
      </div>

      {/* Vocabulary Learning Section */}
      <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Vocabulary</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            <strong>Clicked:</strong> {newTermsCount} {newTermsCount === 1 ? 'term' : 'terms'}
          </p>
          {savedTerms.length > 0 && (
            <p className="text-sm text-gray-700">
              <strong>Saved:</strong> {savedTerms.length} {savedTerms.length === 1 ? 'term' : 'terms'}
            </p>
          )}
          {recommendedTerms.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-900 mb-2">Worth another look:</p>
              <div className="flex flex-wrap gap-2">
                {recommendedTerms.map(term => {
                  const termData = getVocabTerm(term)
                  return termData ? (
                    <button
                      key={term}
                      onClick={() => onTermClick?.(term)}
                      className="px-3 py-1 bg-white border border-purple-300 text-purple-700 rounded-md hover:bg-purple-100 text-sm transition"
                    >
                      {termData.display}
                    </button>
                  ) : null
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overall Rating (no scores shown) */}
      <div className={`mb-6 p-4 rounded-lg border-2 ${ratingColors[assessment.overallRating] || ratingColors.Good}`}>
        <p className="text-lg font-semibold">Overall: {assessment.overallRating}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
        <p className="text-gray-700">
          <VocabText 
            text={assessment.summary} 
            onTermClick={onTermClick}
            onTermSave={onTermSave}
          />
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
          <h3 className="text-lg font-semibold text-emerald-900 mb-2">✅ What You Did Well</h3>
          {assessment.strengths.length === 0 ? (
            <p className="text-sm text-slate-600">Nothing listed — the feedback below still has detail.</p>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {assessment.strengths.map((strength, idx) => (
                <li key={idx}>
                  <VocabText 
                    text={strength} 
                    onTermClick={onTermClick}
                    onTermSave={onTermSave}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">⚠️ What You Missed</h3>
          {assessment.areasForImprovement.length === 0 && assessment.missedKeyHistoryPoints.length === 0 ? (
            <p className="text-sm text-slate-600">No major gaps flagged — nice work staying thorough.</p>
          ) : (
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {assessment.areasForImprovement.map((area, idx) => (
                <li key={idx}>
                  <VocabText 
                    text={area} 
                    onTermClick={onTermClick}
                    onTermSave={onTermSave}
                  />
                </li>
              ))}
              {assessment.missedKeyHistoryPoints.map((point, idx) => (
                <li key={`m-${idx}`}>
                  <VocabText 
                    text={point} 
                    onTermClick={onTermClick}
                    onTermSave={onTermSave}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {ds?.diagnosticReasoning && ds.diagnosticReasoning.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Diagnostic reasoning</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {ds.diagnosticReasoning.map((line, idx) => (
              <li key={idx}>
                <VocabText text={line} onTermClick={onTermClick} onTermSave={onTermSave} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Diagnosis Feedback</h3>
        <p className="text-gray-700">
          <VocabText 
            text={assessment.diagnosisFeedback} 
            onTermClick={onTermClick}
            onTermSave={onTermSave}
          />
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Test Selection Feedback</h3>
        <p className="text-gray-700">
          <VocabText 
            text={assessment.testSelectionFeedback} 
            onTermClick={onTermClick}
            onTermSave={onTermSave}
          />
        </p>
      </div>

      {ds?.nextStepAdvice && ds.nextStepAdvice.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Better next steps</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {ds.nextStepAdvice.map((line, idx) => (
              <li key={idx}>
                <VocabText text={line} onTermClick={onTermClick} onTermSave={onTermSave} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {(ds?.clinicalPearls?.length || scenario.teachingPoints.length > 0) ? (
        <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">🧠 Key Medical Insight</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {(ds?.clinicalPearls ?? []).map((line, idx) => (
              <li key={`pearl-${idx}`}>
                <VocabText text={line} onTermClick={onTermClick} onTermSave={onTermSave} />
              </li>
            ))}
            {scenario.teachingPoints.map((point, idx) => (
              <li key={`tp-${idx}`}>
                <VocabText 
                  text={point} 
                  onTermClick={onTermClick}
                  onTermSave={onTermSave}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {ds?.vocabToReview && ds.vocabToReview.length > 0 && (
        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Vocabulary to review</h3>
          <p className="text-sm text-gray-700">{ds.vocabToReview.join(', ')}</p>
        </div>
      )}

      <div className="mt-8 space-y-4">
        <NextStepGuidance>
          Ask a few more questions — then head to the exam when you feel ready.
        </NextStepGuidance>
        <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-5">
          <p className="font-semibold text-slate-900">What do you want to do next?</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                window.location.href = `/scenarios/${scenario.id}`
              }}
              className="btn-press flex-1 rounded-lg border border-primary-300 bg-white px-4 py-3 text-center text-sm font-semibold text-primary-800 shadow-sm transition hover:bg-primary-50"
            >
              Try Again to Improve Score →
            </button>
            <Link
              href="/scenarios"
              className="btn-press flex-1 rounded-lg bg-primary-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
            >
              Pick Another Case
            </Link>
          </div>
        </div>
      </div>
      </VocabContextBlock>
    </div>
  )
}

