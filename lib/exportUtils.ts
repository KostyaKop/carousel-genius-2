import { toPng } from 'html-to-image'

export async function downloadAllSlides(
  slideRefs: React.RefObject<HTMLDivElement>[],
  baseName: string,
  pixelRatio: number = 2
): Promise<void> {
  const validRefs = slideRefs.filter(ref => ref.current !== null)
  
  if (validRefs.length === 0) {
    console.warn('No valid slide refs to export')
    return
  }

  for (let i = 0; i < validRefs.length; i++) {
    const ref = validRefs[i]
    if (!ref.current) continue

    try {
      const dataUrl = await toPng(ref.current, {
        pixelRatio,
        cacheBust: true,
      })

      // Download
      const link = document.createElement('a')
      link.download = `${baseName}-slide-${i + 1}.png`
      link.href = dataUrl
      link.click()

      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (error) {
      console.error(`Failed to export slide ${i + 1}:`, error)
    }
  }
}

export function getQualityLabel(pixelRatio: number): string {
  if (pixelRatio === 1) return 'Standard (1x)'
  if (pixelRatio === 2) return 'High (2x)'
  if (pixelRatio === 3) return 'Ultra (3x)'
  return `${pixelRatio}x`
}
