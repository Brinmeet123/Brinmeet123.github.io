import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Virtual Diagnostic Simulator
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-8">
            Step into the role of a doctor. Interview AI patients, choose tests, and practice clinical reasoning — safely and fictionally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/scenarios"
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold text-lg"
            >
              Start Scenarios
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg hover:bg-primary-50 transition font-semibold text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { step: '1', title: 'History', desc: 'Interview the AI patient to gather their medical history and symptoms.' },
              { step: '2', title: 'Exam', desc: 'Perform a physical examination by reviewing different body systems.' },
              { step: '3', title: 'Tests', desc: 'Order diagnostic tests to gather more information about the condition.' },
              { step: '4', title: 'Diagnosis', desc: 'Formulate a differential diagnosis and select your final diagnosis.' },
              { step: '5', title: 'Debrief', desc: 'Receive detailed feedback on your clinical reasoning and decision-making.' },
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

      {/* Who It's For */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Who It's For</h2>
          <p className="text-lg text-gray-700 mb-8">
            This simulator is designed for <strong>high school students</strong> and <strong>pre-medical students</strong> who want to:
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Explore Medicine</h3>
              <p className="text-gray-600">
                Get hands-on experience with clinical reasoning and patient interaction in a safe, fictional environment.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Practice Skills</h3>
              <p className="text-gray-600">
                Develop your ability to ask the right questions, interpret findings, and make diagnostic decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Practice */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What You'll Practice</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '💬', title: 'Communication', desc: 'Learn to ask effective questions and build rapport with patients.' },
              { icon: '🧠', title: 'Clinical Reasoning', desc: 'Develop your ability to think through complex medical cases.' },
              { icon: '📊', title: 'Decision-Making', desc: 'Practice choosing appropriate tests and making diagnoses.' },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-4">{item.icon}</div>
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

