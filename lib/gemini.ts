import { GoogleGenerativeAI } from '@google/generative-ai'
import { Slide } from '@/types'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function generateSlidesFromText(
  text: string,
  language: 'uk' | 'en' = 'uk'
): Promise<Slide[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = language === 'uk' ? `
Ти експерт зі створення контенту для Instagram каруселей.

ЗАВДАННЯ: Перетвори наступний текст на структуровану карусель з 5-10 слайдів.

ВХІДНИЙ ТЕКСТ:
"${text}"

ВИМОГИ:
1. Кожен слайд має містити:
   - title: короткий заголовок (2-5 слів)
   - body: опис/контент (1-2 речення, максимум 100 символів)
   - isCta: false для звичайних слайдів, true для останнього CTA слайду

2. Структура каруселі:
   - Слайд 1: Вступний/hook слайд
   - Слайди 2-9: Основний контент (пункти, факти, поради)
   - Останній слайд: Call-to-Action (підписатися, лайкнути, etc)

3. Стиль:
   - Лаконічно та зрозуміло
   - Використовуй емодзі де доречно
   - Кожен пункт має бути цінним

ВІДПОВІДЬ ТІЛЬКИ В JSON ФОРМАТІ:
{
  "slides": [
    {
      "id": "унікальний-id",
      "title": "Заголовок",
      "body": "Текст слайду",
      "isCta": false
    }
  ]
}
` : `
You are an expert at creating Instagram carousel content.

TASK: Transform the following text into a structured carousel with 5-10 slides.

INPUT TEXT:
"${text}"

REQUIREMENTS:
1. Each slide must contain:
   - title: short headline (2-5 words)
   - body: description/content (1-2 sentences, max 100 characters)
   - isCta: false for regular slides, true for the last CTA slide

2. Carousel structure:
   - Slide 1: Hook/intro slide
   - Slides 2-9: Main content (points, facts, tips)
   - Last slide: Call-to-Action (follow, like, etc)

3. Style:
   - Concise and clear
   - Use emojis where appropriate
   - Each point should be valuable

RESPOND ONLY IN JSON FORMAT:
{
  "slides": [
    {
      "id": "unique-id",
      "title": "Title",
      "body": "Slide text",
      "isCta": false
    }
  ]
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const generatedText = response.text()

    // Extract JSON from response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    
    if (!parsed.slides || !Array.isArray(parsed.slides)) {
      throw new Error('Invalid response format')
    }

    // Add crypto random IDs and validate
    const slides: Slide[] = parsed.slides.map((slide: any, index: number) => ({
      id: crypto.randomUUID(),
      title: String(slide.title || `Slide ${index + 1}`),
      body: String(slide.body || ''),
      isCta: Boolean(slide.isCta),
    }))

    // Ensure last slide is CTA
    if (slides.length > 0) {
      slides[slides.length - 1].isCta = true
    }

    return slides

  } catch (error) {
    console.error('Gemini API Error:', error)
    throw new Error('Failed to generate slides from AI')
  }
}
