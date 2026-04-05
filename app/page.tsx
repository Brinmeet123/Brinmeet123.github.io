import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Virtual Diagnostic Simulator
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-8">
            Work fictional cases: history, exam, tests, diagnosis — same flow as the wards, none of the risk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/scenarios"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold text-lg"
            >
              Open scenarios
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition font-semibold text-lg"
            >
              About
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Flow</h2>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { step: '1', title: 'History', desc: 'Take the history and symptoms.' },
              { step: '2', title: 'Exam', desc: 'Review systems and findings.' },
              { step: '3', title: 'Tests', desc: 'Order labs and imaging you need.' },
              { step: '4', title: 'Diagnosis', desc: 'Differential and one final call.' },
              { step: '5', title: 'Debrief', desc: 'Structured feedback on the run.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Audience</h2>
          <p className="text-lg text-gray-700 mb-8">
            Built for <strong>high school</strong> and <strong>pre-med</strong> learners who want reps without the clinic.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Orientation</h3>
              <p className="text-gray-600">
                See how an encounter is structured before you shadow or rotate.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Reps</h3>
              <p className="text-gray-600">
                Drill questions, data interpretation, and committing to a diagnosis.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Skills</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { abbr: 'Hx', title: 'Interview', desc: 'Targeted questions and pacing.' },
              { abbr: 'Dx', title: 'Reasoning', desc: 'Hypotheses, data, and tradeoffs.' },
              { abbr: 'Rx', title: 'Decisions', desc: 'Tests and conclusions under time.' },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-sm font-bold tracking-widest text-primary-700 mb-3">{item.abbr}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
