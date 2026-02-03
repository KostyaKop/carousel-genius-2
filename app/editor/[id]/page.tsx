'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Slide, GlobalSettings } from '@/types'
import { INITIAL_SETTINGS, INITIAL_SLIDES } from '@/lib/constants'
import { useHistory } from '@/hooks/useHistory'
import { downloadAllSlides } from '@/lib/exportUtils'
import EditorPanel from '@/components/editor/EditorPanel'
import PreviewPanel from '@/components/editor/PreviewPanel'

interface AppState {
  slides: Slide[]
  settings: GlobalSettings
}

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const carouselId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('Untitled Carousel')
  const [language, setLanguage] = useState<'uk' | 'en'>('uk')

  // History Hook
  const { 
    state: appState, 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    update 
  } = useHistory<AppState>({
    slides: INITIAL_SLIDES,
    settings: INITIAL_SETTINGS
  })

  const { slides, settings } = appState
  const slideRefs = useRef<HTMLDivElement[]>([])
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load carousel from database
  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    loadCarousel()
  }, [user, carouselId])

  // Auto-save to database
  useEffect(() => {
    if (!loading && user) {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        saveCarousel()
      }, 2000)
    }
  }, [slides, settings, title])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          if (canRedo) redo()
        } else {
          if (canUndo) undo()
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault()
        if (canRedo) redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo])

  const loadCarousel = async () => {
    if (carouselId === 'new') {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('carousels')
        .select('*')
        .eq('id', carouselId)
        .eq('user_id', user!.id)
        .single()

      if (error) throw error

      if (data) {
        setTitle(data.title)
        update({ slides: data.slides, settings: data.settings }, false)
      }
    } catch (error) {
      console.error('Error loading carousel:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const saveCarousel = async () => {
    if (!user || carouselId === 'new') return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('carousels')
        .upsert({
          id: carouselId,
          user_id: user.id,
          title,
          slides,
          settings,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Error saving carousel:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateState = useCallback((
    newState: Partial<AppState>, 
    commit: boolean = true
  ) => {
    update({ ...appState, ...newState }, commit)
  }, [appState, update])

  const handleUpdateSettings = (newSettings: Partial<GlobalSettings>, commit: boolean = true) => {
    updateState({ settings: { ...settings, ...newSettings } }, commit)
  }

  const handleUpdateSlide = (id: string, updates: Partial<Slide>) => {
    const newSlides = slides.map((s) => (s.id === id ? { ...s, ...updates } : s))
    const isTextUpdate = 'title' in updates || 'body' in updates

    if (isTextUpdate) {
      updateState({ slides: newSlides }, false)
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        update({ slides: newSlides, settings }, true)
      }, 600)
    } else {
      updateState({ slides: newSlides }, true)
    }
  }

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: crypto.randomUUID(),
      title: 'New Point',
      body: 'Add your content here...',
      isCta: false,
    }
    updateState({ slides: [...slides, newSlide] }, true)
  }

  const handleRemoveSlide = (id: string) => {
    if (slides.length <= 1) return
    updateState({ slides: slides.filter((s) => s.id !== id) }, true)
  }

  const handleMoveSlide = (id: string, direction: 'up' | 'down') => {
    const index = slides.findIndex((s) => s.id === id)
    if (index === -1) return

    const newSlides = [...slides]
    if (direction === 'up' && index > 0) {
      [newSlides[index], newSlides[index - 1]] = [newSlides[index - 1], newSlides[index]]
    } else if (direction === 'down' && index < newSlides.length - 1) {
      [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]]
    }
    updateState({ slides: newSlides }, true)
  }

  const handleImportSlides = (newSlides: Slide[]) => {
    updateState({ slides: newSlides }, true)
  }

  const handleDownload = async (pixelRatio: number) => {
    const validRefs = slideRefs.current.filter(Boolean)
    const refObjects = validRefs.map(el => ({ current: el }))
    await downloadAllSlides(refObjects, title, pixelRatio)
  }

  const toggleLanguage = () => {
    const newLang = language === 'uk' ? 'en' : 'uk'
    setLanguage(newLang)
    localStorage.setItem('preferredLanguage', newLang)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-gray-950 text-white">
      <EditorPanel
        settings={settings}
        slides={slides}
        language={language}
        onToggleLanguage={toggleLanguage}
        onUpdateSettings={handleUpdateSettings}
        onUpdateSlide={handleUpdateSlide}
        onAddSlide={handleAddSlide}
        onRemoveSlide={handleRemoveSlide}
        onMoveSlide={handleMoveSlide}
        onImportSlides={handleImportSlides}
        onDownload={handleDownload}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <PreviewPanel
        ref={slideRefs}
        slides={slides}
        settings={settings}
        language={language}
      />
      
      {saving && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
          Saving...
        </div>
      )}
    </div>
  )
}
