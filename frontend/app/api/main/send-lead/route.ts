import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { phone_number_subscription } = data

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/main/send-lead/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number_subscription,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return new Response(JSON.stringify(error), { status: response.status })
    }

    const result = await response.json()
    return new Response(JSON.stringify(result), { status: 200 })
  } catch (error) {
    console.error('PATCH /api/main/send-lead error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
