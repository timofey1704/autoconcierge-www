'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import Loader from '@/components/ui/Loader'
import useUserStore from '@/app/store/userStore'
import { getProxiedImageUrl } from '@/lib/imageProxy'

interface QRPayload {
  code: string
}

interface QRData {
  code: string
  imageURL?: string
  account_type: string
  partner: string
  created_at: string
}

interface QRCheckResponse {
  action: 'sell' | 'redirect'
  message: string
  qr_code?: QRData
  redirect_url?: string
}

interface SellResponse {
  message: string
  qr_code: {
    code: string
    is_selled: boolean
    selled_at: string
    selled_by: string
  }
}

const ActivationForm = () => {
  const params = useSearchParams()
  const code = params.get('ref')
  const { user } = useUserStore()
  const [qrData, setQrData] = useState<QRData | null>(null)
  const [error, setError] = useState<string>('')
  const [isRedirecting, setIsRedirecting] = useState(false)

  // проверяем QR код
  const { mutate: checkQR, isLoading: isChecking } = useClientFetch<QRCheckResponse, QRPayload>(
    '/account/verify-qr/',
    {
      method: 'POST',
      mutationOptions: {
        onSuccess: data => {
          console.log('QR Check Response:', data)

          if (data.action === 'redirect' && data.redirect_url) {
            // показываем лоадер и редиректим на сайт партнера
            console.log('Redirecting to:', data.redirect_url)
            setIsRedirecting(true)
            setTimeout(() => {
              window.location.href = data.redirect_url!
            }, 500)
          } else if (data.action === 'sell' && data.qr_code) {
            // показываем QR для продажи
            console.log('Showing sell form')
            setQrData(data.qr_code)
          } else {
            // Неожиданный ответ
            console.error('Unexpected response:', data)
            setError('Неожиданный ответ от сервера')
          }
        },
        onError: error => {
          console.error('QR Check Error:', error)
          setError('Ошибка при проверке QR кода')
        },
      },
    }
  )

  // продаем QR код
  const { mutate: sellQR, isLoading: isSelling } = useClientFetch<SellResponse, QRPayload>(
    '/account/verify-qr/',
    {
      method: 'PATCH',
      mutationOptions: {
        onSuccess: data => {
          // после успешной продажи перепроверяем код (чтобы получить redirect_url)
          if (code) {
            checkQR({ code })
          }
        },
        onError: error => {
          setError('Ошибка при продаже QR кода')
        },
      },
    }
  )

  useEffect(() => {
    // если пользователь не авторизован, используем ПАБЛИК! API для редиректа
    if (!user && code) {
      console.log('User not authenticated, using public API for redirect')
      const redirectUser = async () => {
        try {
          setIsRedirecting(true)
          const API_URL = process.env.NEXT_PUBLIC_API_URL
          const response = await fetch(`${API_URL}/account/verify-qr-public/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          })

          if (!response.ok) {
            throw new Error('Failed to get redirect URL')
          }

          const data = await response.json()
          if (data.redirect_url) {
            console.log('Redirecting to:', data.redirect_url)
            window.location.href = data.redirect_url
          } else {
            setError('Не удалось получить URL для перенаправления')
          }
        } catch (err) {
          console.error('Public redirect error:', err)
          setError('Ошибка при перенаправлении')
        }
      }
      redirectUser()
      return
    }

    // если пользователь авторизован, используем обычный API
    if (user && code) {
      console.log('Checking QR code:', code)
      checkQR({ code })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, user])

  // Отладка состояния
  useEffect(() => {
    console.log('State:', {
      isChecking,
      isSelling,
      isRedirecting,
      hasQrData: !!qrData,
      hasError: !!error,
    })
  }, [isChecking, isSelling, isRedirecting, qrData, error])

  const handleSell = () => {
    if (code) {
      sellQR({ code })
    }
  }

  if (!code) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-red-500">Код не найден в параметрах URL</div>
      </div>
    )
  }

  if (isChecking || isSelling || isRedirecting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader />
        {isRedirecting && (
          <p className="mt-4 text-lg text-gray-600">Перенаправление на сайт партнера...</p>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    )
  }

  if (qrData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-center text-2xl font-bold">Продажа QR кода</h1>

          {qrData.imageURL && (
            <div className="mb-4 flex justify-center">
              <Image
                src={getProxiedImageUrl(qrData.imageURL)}
                alt="QR код"
                width={256}
                height={256}
                className="h-64 w-64 object-contain"
              />
            </div>
          )}

          <div className="mb-6 space-y-2">
            <p className="text-lg">
              <span className="font-semibold">Код:</span> {qrData.code}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Тариф:</span> {qrData.account_type}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Партнер:</span> {qrData.partner}
            </p>
          </div>

          <button
            onClick={handleSell}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-bold text-white transition-colors hover:bg-blue-700"
            disabled={isSelling}
          >
            {isSelling ? 'Продажа...' : 'Активировать'}
          </button>
        </div>
      </div>
    )
  }

  // fallback - не должно попасть сюда в нормальных условиях
  console.warn('Unexpected state - no render condition matched')
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md rounded-lg bg-gray-50 p-6 text-center">
        <p className="text-gray-700">Загрузка...</p>
      </div>
    </div>
  )
}

export default ActivationForm
