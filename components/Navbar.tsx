import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-primary-600 hover:text-primary-700">
            Virtual Diagnostic Simulator
          </Link>
          <div className="flex space-x-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Home
            </Link>
            <Link
              href="/scenarios"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Scenarios
            </Link>
            <Link
              href="/vocab"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Vocab
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

