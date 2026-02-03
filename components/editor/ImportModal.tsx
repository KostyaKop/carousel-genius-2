'use client'

import { useState } from 'react'
import { X, Sparkles, Loader2 } from 'lucide-react'
import { Slide } from '@/types'
import { t } from '@/lib/i18n'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (slides: Slide[]) => void
  language: 'uk' | 'en'
}

export default function ImportModal({ isOpen, onClose, onImport, language }: ImportModalProps) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleImport = async () => {
    if (!text.trim()) {
      setError(language === 'uk' ? 'Введіть текст для імпорту' : 'Enter text to import')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/ai-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language }),
      })

      if (!response.ok) {
        throw new Error('Failed to import')
      }

      const data = await response.json()
      
      if (data.slides && Array.isArray(data.slides)) {
        onImport(data.slides)
        setText('')
        onClose()
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Import error:', err)
      setError(
        language === 'uk' 
          ? 'Помилка імпорту. Спробуйте ще раз.'
          : 'Import failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-500" size={24} />
            <h2 className="text-xl font-bold text-white">
              {language === 'uk' ? 'AI Імпорт' : 'AI Import'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {language === 'uk' 
                ? 'Введіть текст або опис вашої карусельки:'
                : 'Enter text or description of your carousel:'}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                language === 'uk'
                  ? 'Наприклад: "Створи карусель про 5 переваг здорового харчування"'
                  : 'e.g., "Create a carousel about 5 benefits of healthy eating"'
              }
              rows={8}
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-400">
              {language === 'uk' ? (
                <>
                  <strong className="text-gray-300">Підказка:</strong> Опишіть тему, кількість слайдів та ключові моменти. 
                  AI автоматично створить структуровану карусель з вашого тексту.
                </>
              ) : (
                <>
                  <strong className="text-gray-300">Tip:</strong> Describe the topic, number of slides, and key points. 
                  AI will automatically create a structured carousel from your text.
                </>
              )}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors text-white"
            >
              {t('cancel', language)}
            </button>
            <button
              onClick={handleImport}
              disabled={loading || !text.trim()}
              className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors text-white flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  {language === 'uk' ? 'Генерація...' : 'Generating...'}
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  {language === 'uk' ? 'Згенерувати' : 'Generate'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
