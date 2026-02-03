import { forwardRef } from 'react'
import { Slide, GlobalSettings } from '@/types'
import { ChevronRight, Heart } from 'lucide-react'

interface SlidePreviewProps {
  slide: Slide
  settings: GlobalSettings
  language?: 'uk' | 'en'
}

function parseText(text: string, accentColor: string): React.ReactNode[] {
  const regex = /\*(.*?)\*/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(
      <strong key={match.index} style={{ color: accentColor }}>
        {match[1]}
      </strong>
    )
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

const SlidePreview = forwardRef<HTMLDivElement, SlidePreviewProps>(
  ({ slide, settings, language = 'uk' }, ref) => {
    const aspectRatios = {
      portrait: 'aspect-[4/5]',
      square: 'aspect-square',
      story: 'aspect-[9/16]',
    }

    const fontFamilies: Record<string, string> = {
      Inter: 'font-sans',
      Roboto: 'font-sans',
      Montserrat: 'font-sans',
      'Playfair Display': 'font-serif',
    }

    return (
      <div
        ref={ref}
        className={`relative ${aspectRatios[settings.aspectRatio]} w-full overflow-hidden rounded-lg shadow-xl`}
        style={{
          backgroundColor: settings.bgColor,
          fontFamily: settings.fontFamily,
        }}
      >
        {/* Content */}
        <div
          className={`relative h-full flex flex-col justify-between p-8 ${fontFamilies[settings.fontFamily] || 'font-sans'}`}
          style={{ color: settings.textColor }}
        >
          {/* Top Section - Handle */}
          {settings.handle && (
            <div className="text-sm opacity-80 font-medium">{settings.handle}</div>
          )}

          {/* Middle Section - Title & Body */}
          <div className="flex-1 flex flex-col justify-center space-y-4">
            {slide.title && (
              <h2
                className="font-bold leading-tight"
                style={{
                  fontSize: `${2.5 * settings.titleScale}rem`,
                  lineHeight: 1.2,
                }}
              >
                {parseText(slide.title, settings.accentColor)}
              </h2>
            )}
            {slide.body && (
              <p
                className="opacity-90 leading-relaxed"
                style={{
                  fontSize: `${1.125 * settings.bodyScale}rem`,
                  lineHeight: 1.6,
                }}
              >
                {parseText(slide.body, settings.accentColor)}
              </p>
            )}

            {/* CTA for last slide */}
            {slide.isCta && (
              <div className="flex gap-4 mt-6">
                <button
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-all hover:scale-105 font-semibold"
                  style={{
                    borderColor: settings.accentColor,
                    color: settings.accentColor,
                  }}
                >
                  <Heart className="w-5 h-5" />
                  <span>{language === 'uk' ? 'Підписатися' : 'Follow'}</span>
                </button>
                <button
                  className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all hover:scale-105 font-semibold"
                  style={{
                    backgroundColor: settings.accentColor,
                    color: settings.bgColor,
                  }}
                >
                  <span>{language === 'uk' ? 'Поділитися' : 'Share'}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Bottom Section - Swipe Indicator */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <span className="text-sm font-medium" style={{ color: settings.accentColor }}>
              {language === 'uk' ? 'Гортай' : 'Swipe'}
            </span>
            <ChevronRight className="w-4 h-4" style={{ color: settings.accentColor }} />
          </div>
        </div>
      </div>
    )
  }
)

SlidePreview.displayName = 'SlidePreview'

// Default export
export default SlidePreview
