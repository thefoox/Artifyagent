import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Artify Agent - AI-Powered Print Automation',
  description: 'Automate your print-on-demand business with AI-powered product creation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    🎨 Artify Agent
                  </h1>
                  <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Demo Mode
                  </span>
                </div>
                <nav className="flex space-x-8">
                  <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                    Upload
                  </a>
                  <a href="/products" className="text-gray-700 hover:text-blue-600 font-medium">
                    Products
                  </a>
                  <a href="/docs" className="text-gray-700 hover:text-blue-600 font-medium">
                    Docs
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
} 