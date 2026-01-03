'use client'

export type ClinicalSection = 'history' | 'exam' | 'tests' | 'diagnosis' | 'debrief'

type SectionInfo = {
  id: ClinicalSection
  label: string
  disabled?: boolean
  disabledReason?: string
}

type Props = {
  active: ClinicalSection
  onChange: (section: ClinicalSection) => void
  sections: SectionInfo[]
}

export default function SectionNav({ active, onChange, sections }: Props) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop: Horizontal tabs */}
        <div className="hidden md:flex">
          {sections.map((section) => {
            const isActive = active === section.id
            const isDisabled = section.disabled

            return (
              <button
                key={section.id}
                onClick={() => !isDisabled && onChange(section.id)}
                disabled={isDisabled}
                className={`
                  relative px-6 py-4 text-sm font-medium transition-colors
                  border-b-2
                  ${
                    isActive
                      ? 'border-primary-600 text-primary-600'
                      : isDisabled
                      ? 'border-transparent text-gray-400 cursor-not-allowed'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
                title={isDisabled ? section.disabledReason : undefined}
              >
                {section.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                )}
              </button>
            )
          })}
        </div>

        {/* Mobile: Horizontal scrollable tabs */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto scrollbar-hide -mx-4 px-4">
            {sections.map((section) => {
              const isActive = active === section.id
              const isDisabled = section.disabled

              return (
                <button
                  key={section.id}
                  onClick={() => !isDisabled && onChange(section.id)}
                  disabled={isDisabled}
                  className={`
                    flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors
                    border-b-2
                    ${
                      isActive
                        ? 'border-primary-600 text-primary-600'
                        : isDisabled
                        ? 'border-transparent text-gray-400 cursor-not-allowed'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }
                  `}
                  title={isDisabled ? section.disabledReason : undefined}
                >
                  {section.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

