import Link from 'next/link'
import { ArrowRight, Sparkles, Languages, Download } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">
            Create Stunning Carousels
            <br />
            in Minutes, Not Hours
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8">
            AI-powered carousel generator for Instagram, LinkedIn, and TikTok.
            Translate, customize, and export in HD quality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 rounded-lg text-lg font-semibold transition-colors"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-lg font-semibold transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why CarouselGenius?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-900 rounded-xl">
              <div className="w-12 h-12 bg-brand-600 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI-Powered Import</h3>
              <p className="text-gray-400">
                Upload images and let Gemini AI extract and translate text automatically.
                Support for Ukrainian, English, and Polish.
              </p>
            </div>
            <div className="p-6 bg-gray-900 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Languages className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Multi-Language</h3>
              <p className="text-gray-400">
                Full interface in Ukrainian and English. Translate carousels between languages instantly.
              </p>
            </div>
            <div className="p-6 bg-gray-900 rounded-xl">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3">HD Export</h3>
              <p className="text-gray-400">
                Download all slides as high-quality PNG files. Choose between Standard, High, and Ultra quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Simple Pricing</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <div className="p-8 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-6">$0<span className="text-xl text-gray-400">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>3 carousels per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>AI import & translation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Basic fonts & backgrounds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">⚠</span>
                  <span className="text-gray-400">Watermark on export</span>
                </li>
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="p-8 bg-gradient-to-br from-brand-600 to-purple-600 rounded-xl relative">
              <div className="absolute -top-4 right-8 px-4 py-1 bg-yellow-500 text-black text-sm font-bold rounded-full">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-6">$15<span className="text-xl opacity-80">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-green-300">✓</span>
                  <span>Unlimited carousels</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-300">✓</span>
                  <span>No watermark</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-300">✓</span>
                  <span>Premium fonts & backgrounds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-300">✓</span>
                  <span>Ultra HD export (3x quality)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-300">✓</span>
                  <span>Priority AI processing</span>
                </li>
              </ul>
              <Link
                href="/signup?plan=pro"
                className="block w-full text-center px-6 py-3 bg-white text-brand-600 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2026 CarouselGenius. Made with 💙 in Ukraine.</p>
        </div>
      </footer>
    </main>
  )
}
