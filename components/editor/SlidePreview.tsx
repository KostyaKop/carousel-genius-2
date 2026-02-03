import { forwardRef } from 'react'
import { Slide, GlobalSettings } from '@/types'
import { ChevronRight, Heart } from 'lucide-react'

interface SlidePreviewProps {
  slide: Slide
  settings: GlobalSettings
  slideNumber: number
  totalSlides: number
}

function parseText(text: string): React.ReactNode[] {
  const regex = /\*(.*?)\*/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(
      <strong key={match.index} style={{ color: settings.accentColor }}>
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

export const SlidePreview = forwardRef<HTMLDivElement, SlidePreviewProps>(
  ({ slide, settings, slideNumber, totalSlides }, ref) => {
    const aspectRatios = {
      portrait: 'aspect-[4/5]',
      square: 'aspect-square',
      story: 'aspect-[9/16]',
    }

    const fontFamilies: Record<string, string> = {
      Inter: 'font-inter',
      Merriweather: 'font-serif',
      Montserrat: 'font-montserrat',
      'Bebas Neue': 'font-bebas',
      Unbounded: 'font-unbounded',
    }

    return (
      <div
        ref={ref}
        className={`relative ${aspectRatios[settings.aspectRatio]} w-full overflow-hidden rounded-lg`}
        style={{
          fontFamily: fontFamilies[settings.fontTheme] || 'font-inter',
        }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${settings.backgroundImage})`,
          }}
        />

        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: settings.overlayOpacity / 100 }}
        />

        {/* Content */}
        <div
          className={`relative h-full flex flex-col justify-between p-8 ${fontFamilies[settings.fontTheme]}`}
          style={{ color: settings.textColor }}
        >
          {/* Top Section - Handle */}
          {settings.handle && (
            <div className="text-sm opacity-80">{settings.handle}</div>
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
                {parseText(slide.title)}
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
                {parseText(slide.body)}
              </p>
            )}

            {/* CTA for last slide */}
            {slide.isCta && (
              <div className="flex gap-4 mt-4">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-transform hover:scale-105"
                  style={{
                    borderColor: settings.accentColor,
                    color: settings.accentColor,
                  }}
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-semibold">Save</span>
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-transform hover:scale-105"
                  style={{
                    borderColor: settings.accentColor,
                    color: settings.accentColor,
                  }}
                >
                  <span className="font-semibold">Share</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Bottom Section - Swipe Indicator */}
          <div className="flex justify-center items-center gap-1">
            {settings.swipeStyle === 'dots' ? (
              <>
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === slideNumber - 1 ? 'w-6' : ''
                    }`}
                    style={{
                      backgroundColor:
                        i === slideNumber - 1
                          ? settings.accentColor
                          : `${settings.textColor}40`,
                    }}
                  />
                ))}
              </>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <span style={{ color: settings.accentColor }}>
                  Swipe
                </span>
                <ChevronRight className="w-4 h-4" style={{ color: settings.accentColor }} />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)

SlidePreview.displayName = 'SlidePreview'
