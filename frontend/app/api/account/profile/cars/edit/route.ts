import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }

    // Получаем FormData из запроса
    const formData = await req.formData()
    const sendFormData = new FormData()

    // Добавляем все текстовые поля
    const textFields = [
      'id',
      'brand',
      'model',
      'body_type',
      'year_built',
      'color',
      'vin_code',
      'licence_plate',
    ]
    textFields.forEach(field => {
      const value = formData.get(field)
      if (value) {
        sendFormData.append(field, value.toString())
      }
    })

    // Добавляем изображение если оно есть
    const image = formData.get('image')
    if (image instanceof Blob) {
      sendFormData.append('image', image)
    }

    const carId = formData.get('id')
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/account/edit-car/${carId}/`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: sendFormData,
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return new Response(JSON.stringify(error), { status: response.status })
    }

    const result = await response.json()
    return new Response(JSON.stringify(result), { status: 200 })
  } catch (error) {
    console.error('PATCH /api/profile/cars/edit error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
