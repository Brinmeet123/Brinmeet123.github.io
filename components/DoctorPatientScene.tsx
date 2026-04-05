'use client'

type Props = {
  patientName: string
  onPatientClick?: () => void
}

export default function DoctorPatientScene({ patientName, onPatientClick }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Encounter</h2>
      <div className="flex flex-col sm:flex-row justify-around items-center gap-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-2">
            <span className="text-sm font-bold tracking-tight text-primary-900">You</span>
          </div>
          <p className="text-sm font-medium text-gray-700">Clinician</p>
        </div>
        <div className="text-slate-300 text-xl font-light" aria-hidden>
          |
        </div>
        <button
          type="button"
          onClick={onPatientClick}
          className="flex flex-col items-center hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-2">
            <span className="text-sm font-bold tracking-tight text-blue-900">Pt</span>
          </div>
          <p className="text-sm font-medium text-gray-700">{patientName}</p>
        </button>
      </div>
    </div>
  )
}
