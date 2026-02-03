'use client'

import { useState } from 'react'
import { GlobalSettings, Slide } from '@/types'
import { ChevronLeft, ChevronRight, Download, RotateCcw, RotateCw, Sparkles, Settings } from 'lucide-react'
import ImportModal from './ImportModal'
import { t } from '@/lib/i18n'

interface EditorPanelProps {
  settings: GlobalSettings
  slides: Slide[]
  language: 'uk' | 'en'
  onToggleLanguage: () => void
  onUpdateSettings: (settings: Partial<GlobalSettings>, commit?: boolean) => void
  onUpdateSlide: (id: string, updates: Partial<Slide>) => void
  onAddSlide: () => void
  onRemoveSlide: (id: string) => void
  onMoveSlide: (id: string, direction: 'up' | 'down') => void
  onImportSlides: (slides: Slide[]) => void
  onDownload: (pixelRatio: number) => Promise<void>
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

export default function EditorPanel({
  settings,
  slides,
  language,
  onToggleLanguage,
  onUpdateSettings,
  onUpdateSlide,
  onAddSlide,
  onRemoveSlide,
  onMoveSlide,
  onImportSlides,
  onDownload,
  undo,
  redo,
  canUndo,
  canRedo,
}: EditorPanelProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [activeSlide, setActiveSlide] = useState<string | null>(slides[0]?.id || null)
  const [exportQuality, setExportQuality] = useState<1 | 2 | 3>(2)
  const [isExporting, setIsExporting] = useState(false)

  const handleDownload = async () => {
    setIsExporting(true)
    try {
      await onDownload(exportQuality)
    } finally {
      setIsExporting(false)
    }
  }

  const activeSlideData = slides.find(s => s.id === activeSlide)

  return (
    <>
      <div className="w-full lg:w-96 border-r border-gray-800 flex flex-col bg-gray-900 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-white">Carousel Editor</h1>
            <div className="flex gap-2">
              <button
                onClick={onToggleLanguage}
                className="px-3 py-1 text-xs font-medium bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white"
              >
                {language === 'uk' ? '🇺🇦 UA' : '🇬🇧 EN'}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-white"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>

          {/* Undo/Redo */}
          <div className="flex gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="flex-1 p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2 text-white"
            >
              <RotateCcw size={16} />
              <span className="text-sm">{t('undo', language)}</span>
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="flex-1 p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2 text-white"
            >
              <RotateCw size={16} />
              <span className="text-sm">{t('redo', language)}</span>
            </button>
          </div>
        </div>

        {/* Global Settings */}
        {showSettings && (
          <div className="p-4 border-b border-gray-800 bg-gray-900 space-y-3">
            <h3 className="font-semibold text-white mb-2">Global Settings</h3>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Background Color</label>
              <input
                type="color"
                value={settings.bgColor}
                onChange={(e) => onUpdateSettings({ bgColor: e.target.value }, false)}
                onBlur={() => onUpdateSettings({ bgColor: settings.bgColor }, true)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Font Family</label>
              <select
                value={settings.fontFamily}
                onChange={(e) => onUpdateSettings({ fontFamily: e.target.value })}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Playfair Display">Playfair Display</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Accent Color</label>
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => onUpdateSettings({ accentColor: e.target.value }, false)}
                onBlur={() => onUpdateSettings({ accentColor: settings.accentColor }, true)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Slides List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Slides ({slides.length})</h3>
            <button
              onClick={() => setShowImport(true)}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm flex items-center gap-1 transition-colors text-white"
            >
              <Sparkles size={14} />
              AI Import
            </button>
          </div>

          <div className="space-y-2">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  activeSlide === slide.id
                    ? 'border-indigo-500 bg-indigo-950/30'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
                onClick={() => setActiveSlide(slide.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium text-gray-400">Slide {index + 1}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onMoveSlide(slide.id, 'up')
                      }}
                      disabled={index === 0}
                      className="p-1 hover:bg-gray-700 rounded disabled:opacity-30 transition-colors"
                    >
                      <ChevronLeft size={14} className="text-gray-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onMoveSlide(slide.id, 'down')
                      }}
                      disabled={index === slides.length - 1}
                      className="p-1 hover:bg-gray-700 rounded disabled:opacity-30 transition-colors"
                    >
                      <ChevronRight size={14} className="text-gray-400" />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-medium text-white mb-1 truncate">{slide.title}</p>
                <p className="text-xs text-gray-400 truncate">{slide.body}</p>
                {slide.isCta && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-indigo-600 text-xs rounded text-white">
                    CTA Slide
                  </span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={onAddSlide}
            className="w-full mt-3 p-3 border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            + Add Slide
          </button>
        </div>

        {/* Slide Editor */}
        {activeSlideData && (
          <div className="p-4 border-t border-gray-800 bg-gray-900">
            <h3 className="font-semibold text-white mb-3">Edit Slide</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  value={activeSlideData.title}
                  onChange={(e) => onUpdateSlide(activeSlideData.id, { title: e.target.value })}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Body</label>
                <textarea
                  value={activeSlideData.body}
                  onChange={(e) => onUpdateSlide(activeSlideData.id, { body: e.target.value })}
                  rows={3}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCta"
                  checked={activeSlideData.isCta}
                  onChange={(e) => onUpdateSlide(activeSlideData.id, { isCta: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isCta" className="text-sm text-gray-300">Mark as CTA Slide</label>
              </div>
              {slides.length > 1 && (
                <button
                  onClick={() => {
                    onRemoveSlide(activeSlideData.id)
                    setActiveSlide(slides[0]?.id || null)
                  }}
                  className="w-full p-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors text-white"
                >
                  Delete Slide
                </button>
              )}
            </div>
          </div>
        )}

        {/* Export */}
        <div className="p-4 border-t border-gray-800 bg-gray-950">
          <div className="mb-3">
            <label className="block text-sm text-gray-400 mb-2">Export Quality</label>
            <select
              value={exportQuality}
              onChange={(e) => setExportQuality(Number(e.target.value) as 1 | 2 | 3)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            >
              <option value="1">Standard (1x)</option>
              <option value="2">High (2x)</option>
              <option value="3">Ultra (3x)</option>
            </select>
          </div>
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-white"
          >
            <Download size={18} />
            {isExporting ? 'Exporting...' : 'Download All Slides'}
          </button>
        </div>
      </div>

      <ImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImport={onImportSlides}
        language={language}
      />
    </>
  )
}
