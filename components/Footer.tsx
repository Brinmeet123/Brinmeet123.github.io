import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-sm text-gray-600">
          <p className="mb-2">
            <strong>Training only.</strong> Fictional cases. Not medical advice.
          </p>
          <p className="mb-4">
            No real patients. For health concerns, see a licensed clinician.
          </p>
          <Link
            href="/about"
            className="text-primary-600 hover:text-primary-700 underline"
          >
            Learn more
          </Link>
        </div>
      </div>
    </footer>
  )
}

