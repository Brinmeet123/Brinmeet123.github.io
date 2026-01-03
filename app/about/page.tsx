import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About</h1>
      
      <div className="prose prose-lg max-w-none mb-8">
        <p className="text-gray-700 mb-4">
          The <strong>Virtual Diagnostic Simulator</strong> is a fictional medical training simulator designed 
          to help students practice clinical reasoning, patient communication, and diagnostic decision-making 
          in a safe, educational environment.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Purpose</h2>
        <p className="text-gray-700 mb-4">
          This simulator is intended for <strong>educational purposes only</strong>. It provides a platform for:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>High school students exploring careers in medicine</li>
          <li>Pre-medical students practicing clinical skills</li>
          <li>Anyone interested in understanding how doctors approach patient cases</li>
        </ul>
        
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How It Works</h2>
        <p className="text-gray-700 mb-4">
          In each scenario, you step into the role of a doctor evaluating a fictional patient. You can:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>Interview the AI-powered patient to gather their medical history</li>
          <li>Perform a physical examination by reviewing different body systems</li>
          <li>Order diagnostic tests to gather more information</li>
          <li>Formulate a differential diagnosis and select your final diagnosis</li>
          <li>Receive detailed feedback on your clinical reasoning</li>
        </ul>
        
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Inspiration</h2>
        <p className="text-gray-700 mb-4">
          This simulator is inspired by medical simulation tools like "Full Code" and "Body Interact", 
          but is custom-built and simplified for educational use. All scenarios are fictional and designed 
          specifically for learning purposes.
        </p>
        
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mt-8 mb-8">
          <h2 className="text-2xl font-bold text-red-900 mb-4">⚠️ Important Disclaimer</h2>
          <div className="text-red-900 space-y-3">
            <p className="font-semibold">
              This website is for educational purposes only. All patients and scenarios are fictional.
            </p>
            <p>
              The site does <strong>not</strong> provide medical advice, diagnosis, or treatment. 
              The information presented here is not a substitute for professional medical care.
            </p>
            <p>
              If you have health concerns, symptoms, or need medical advice, please see a licensed 
              healthcare professional. Do not use this simulator to make decisions about real medical 
              conditions or treatments.
            </p>
            <p>
              This tool is designed to help students learn about clinical reasoning in a fictional 
              context, not to train them to treat real patients.
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <Link
            href="/scenarios"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
          >
            Start Practicing →
          </Link>
        </div>
      </div>
    </div>
  )
}

