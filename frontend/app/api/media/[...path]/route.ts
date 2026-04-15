import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
  const backendUrl = new URL(apiUrl)

  // защита от SSRF: хост подключается только из доверенных энвов
  if (!['http:', 'https:'].includes(backendUrl.protocol)) {
    return new NextResponse('Invalid backend URL protocol', { status: 500 })
  }

  // только безопасные пути к медиафайлам
  backendUrl.pathname = backendUrl.pathname.replace(/\/api\/v1\/?$/, '/')
  const pathname = request.nextUrl.pathname
  const rawPath = pathname.replace('/api/media/', '')
  const pathSegments = rawPath.split('/').filter(Boolean)

  if (
    pathSegments.length === 0 ||
    pathSegments.some(segment => segment === '..' || segment.includes('\\'))
  ) {
    return new NextResponse('Invalid media path', { status: 400 })
  }

  const safePath = pathSegments.map(segment => encodeURIComponent(segment)).join('/')
  const imageUrl = new URL(`media/${safePath}`, backendUrl)

  try {
    const response = await fetch(imageUrl)

    if (!response.ok) {
      console.error('Image not found on backend')
      return new NextResponse('Image not found', { status: 404 })
    }

    const blob = await response.blob()

    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error proxying image:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return new NextResponse('Error loading image', { status: 500 })
  }
}
