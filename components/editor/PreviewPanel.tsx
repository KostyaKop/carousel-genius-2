'use client'

import { forwardRef } from 'react'
import { GlobalSettings, Slide } from '@/types'
import SlidePreview from './SlidePreview'

interface PreviewPanelProps {
  slides: Slide[]
  settings: GlobalSettings
  language: 'uk' | 'en'
}

const PreviewPanel = forwardRef<HTMLDivElement[], PreviewPanelProps>((
  { slides, settings, language },
  ref
) => {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-950 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Preview</h2>
          <p className="text-gray-400 text-sm">Live preview of your carousel slides</p>
        </div>

        <div className="space-y-6">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              ref={(el) => {
                if (ref && typeof ref !== 'function' && ref.current) {
                  ref.current[index] = el as HTMLDivElement
                }
              }}
              className="transform transition-all hover:scale-[1.02]"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">
                  Slide {index + 1} of {slides.length}
                </span>
                {slide.isCta && (
                  <span className="px-2 py-0.5 bg-indigo-600 text-xs rounded text-white font-medium">
                    CTA
                  </span>
                )}
              </div>
              <SlidePreview
                slide={slide}
                settings={settings}
                language={language}
              />
            </div>
          ))}
        </div>

        {slides.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No slides yet. Add your first slide!</p>
          </div>
        )}
      </div>
    </div>
  )
})

PreviewPanel.displayName = 'PreviewPanel'

export default PreviewPanel
