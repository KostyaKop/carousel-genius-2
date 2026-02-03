import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Slide } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('images') as File[]
    const targetLanguage = formData.get('targetLanguage') as string || 'uk'

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
    const slides: Slide[] = []

    for (const file of files) {
      try {
        // Convert File to base64
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = buffer.toString('base64')

        const languagePrompt = targetLanguage === 'uk' 
          ? 'Ukrainian' 
          : targetLanguage === 'en' 
          ? 'English' 
          : 'Polish'

        const prompt = `Analyze this image and extract the text content. 
        If there is text, translate it to ${languagePrompt}.
        Return ONLY a JSON object with this structure:
        {
          "title": "main heading or title (max 60 characters)",
          "body": "supporting text or description (max 200 characters)"
        }
        
        If no text is found, return:
        {
          "title": "Slide ${slides.length + 1}",
          "body": "Add your content here..."
        }
        
        Do not include any markdown formatting or code blocks, just the raw JSON.`

        const result = await model.generateContent([
          {
            inlineData: {
              data: base64,
              mimeType: file.type
            }
          },
          prompt
        ])

        const responseText = result.response.text()
        
        // Try to extract JSON from response
        let extractedData
        try {
          // Remove potential markdown code blocks
          const cleanedText = responseText
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim()
          
          extractedData = JSON.parse(cleanedText)
        } catch (parseError) {
          console.error('Failed to parse AI response:', responseText)
          extractedData = {
            title: `Slide ${slides.length + 1}`,
            body: 'Translation failed. Please edit manually.'
          }
        }

        slides.push({
          id: crypto.randomUUID(),
          title: extractedData.title || `Slide ${slides.length + 1}`,
          body: extractedData.body || 'Add your content here...',
          isCta: false
        })
      } catch (fileError) {
        console.error('Error processing file:', fileError)
        // Add placeholder slide on error
        slides.push({
          id: crypto.randomUUID(),
          title: `Slide ${slides.length + 1}`,
          body: 'Error processing image',
          isCta: false
        })
      }
    }

    return NextResponse.json({ slides })
  } catch (error) {
    console.error('AI Import error:', error)
    return NextResponse.json(
      { error: 'Failed to process images' },
      { status: 500 }
    )
  }
}
