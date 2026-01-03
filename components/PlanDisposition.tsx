'use client'

import { useState } from 'react'
import { Plan, Disposition } from '@/data/scenarios'

type Props = {
  onComplete: (plan: Plan) => void
}

export default function PlanDisposition({ onComplete }: Props) {
  const [disposition, setDisposition] = useState<Disposition | null>(null)
  const [planDetails, setPlanDetails] = useState('')
  const [consultations, setConsultations] = useState<string[]>([])
  const [monitoring, setMonitoring] = useState<string[]>([])

  const handleConsultationAdd = () => {
    const consult = prompt('Consultation needed:')
    if (consult) {
      setConsultations(prev => [...prev, consult])
    }
  }

  const handleMonitoringAdd = () => {
    const monitor = prompt('Monitoring needed:')
    if (monitor) {
      setMonitoring(prev => [...prev, monitor])
    }
  }

  const handleSubmit = () => {
    if (disposition && planDetails.trim()) {
      onComplete({
        disposition,
        planDetails,
        consultations: consultations.length > 0 ? consultations : undefined,
        monitoring: monitoring.length > 0 ? monitoring : undefined,
      })
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 11: Plan and Disposition</h2>
      <p className="text-gray-600 mb-6">
        Decide next steps in the simulated world. (Educational only - not real medical advice)
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Disposition:
          </label>
          <div className="space-y-2">
            {(['Discharge', 'Observe', 'Admit', 'ICU'] as Disposition[]).map(disp => (
              <label key={disp} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="disposition"
                  value={disp}
                  checked={disposition === disp}
                  onChange={() => setDisposition(disp)}
                  className="mr-3"
                />
                <span className="text-sm text-gray-900">{disp}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plan Details:
          </label>
          <textarea
            value={planDetails}
            onChange={(e) => setPlanDetails(e.target.value)}
            placeholder="Describe the treatment plan, medications, follow-up, etc."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Consultations:
          </label>
          <button
            onClick={handleConsultationAdd}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 mb-2"
          >
            + Add Consultation
          </button>
          <div className="space-y-1">
            {consultations.map((consult, idx) => (
              <span key={idx} className="block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {consult}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monitoring:
          </label>
          <button
            onClick={handleMonitoringAdd}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 mb-2"
          >
            + Add Monitoring
          </button>
          <div className="space-y-1">
            {monitoring.map((monitor, idx) => (
              <span key={idx} className="block px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                {monitor}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!disposition || !planDetails.trim()}
        className="w-full mt-6 px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
      >
        Complete Case - Get Assessment
      </button>
    </div>
  )
}

