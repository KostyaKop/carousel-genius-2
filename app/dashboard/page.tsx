'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Plus, LogOut, Trash2, Clock } from 'lucide-react'

interface Carousel {
  id: string
  title: string
  created_at: string
  updated_at: string
  slides: any[]
}

export default function DashboardPage() {
  const { user, profile, signOut, loading: authLoading } = useAuth()
  const [carousels, setCarousels] = useState<Carousel[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadCarousels()
    }
  }, [user])

  const loadCarousels = async () => {
    try {
      const { data, error } = await supabase
        .from('carousels')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setCarousels(data || [])
    } catch (error) {
      console.error('Failed to load carousels:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteCarousel = async (id: string) => {
    if (!confirm('Are you sure you want to delete this carousel?')) return

    try {
      const { error } = await supabase.from('carousels').delete().eq('id', id)
      if (error) throw error
      setCarousels(carousels.filter(c => c.id !== id))
    } catch (error) {
      console.error('Failed to delete carousel:', error)
    }
  }

  const createNewCarousel = async () => {
    // Check free tier limit
    if (profile?.subscription_tier === 'free' && (profile?.carousels_count || 0) >= 3) {
      alert('Free tier limit reached! Upgrade to Pro for unlimited carousels.')
      return
    }

    try {
      const { data, error } = await supabase
        .from('carousels')
        .insert({
          user_id: user?.id,
          title: 'Untitled Carousel',
          slides: [
            { id: '1', title: 'First Slide', body: 'Start editing...', isCta: false },
          ],
          settings: {
            aspectRatio: 'portrait',
            fontTheme: 'Inter',
            accentColor: '#facc15',
            textColor: '#ffffff',
          },
        })
        .select()
        .single()

      if (error) throw error
      router.push(`/editor/${data.id}`)
    } catch (error) {
      console.error('Failed to create carousel:', error)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  const isFreeTier = profile?.subscription_tier === 'free'
  const carouselsUsed = profile?.carousels_count || 0

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">CarouselGenius</h1>
            <p className="text-sm text-gray-400">Welcome, {user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Banner */}
        {isFreeTier && (
          <div className="mb-8 p-6 bg-gradient-to-r from-brand-600/10 to-purple-600/10 border border-brand-500/20 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Free Plan</h3>
                <p className="text-gray-400">
                  {carouselsUsed} / 3 carousels used this month
                </p>
              </div>
              <Link
                href="/pricing"
                className="px-6 py-3 bg-brand-600 hover:bg-brand-700 rounded-lg font-semibold transition-colors"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        )}

        {/* Carousels Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">My Carousels</h2>
          <button
            onClick={createNewCarousel}
            className="flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 rounded-lg font-semibold transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Carousel
          </button>
        </div>

        {carousels.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No carousels yet</h3>
            <p className="text-gray-400 mb-6">
              Create your first carousel to get started
            </p>
            <button
              onClick={createNewCarousel}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 rounded-lg font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Carousel
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carousels.map((carousel) => (
              <div
                key={carousel.id}
                className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-brand-500 transition-colors"
              >
                {/* Preview Thumbnail */}
                <Link href={`/editor/${carousel.id}`}>
                  <div className="aspect-[4/3] bg-gray-800 flex items-center justify-center relative overflow-hidden">
                    <div className="text-6xl font-bold text-gray-700">
                      {carousel.slides.length}
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded text-xs">
                      {carousel.slides.length} slides
                    </div>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-4">
                  <Link href={`/editor/${carousel.id}`}>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-brand-500 transition-colors truncate">
                      {carousel.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(carousel.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/editor/${carousel.id}`}
                      className="flex-1 text-center px-4 py-2 bg-brand-600 hover:bg-brand-700 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteCarousel(carousel.id)}
                      className="px-4 py-2 bg-gray-800 hover:bg-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
