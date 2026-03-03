'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import useUserStore from '@/app/store/userStore'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import Loader from '@/components/ui/Loader'
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
  const { user, isAuthChecked } = useUserStore()
  const [qrData, setQrData] = useState<QRData | null>(null)
  const [error, setError] = useState<string>('')
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // проверяем QR код
  const { mutate: checkQR, isLoading: isChecking } = useClientFetch<QRCheckResponse, QRPayload>(
    '/account/verify-qr/',
    {
      method: 'POST',
      mutationOptions: {
        onSuccess: data => {
          if (data.action === 'redirect' && data.redirect_url) {
            setIsRedirecting(true)
            setTimeout(() => {
              window.location.href = data.redirect_url!
            }, 500)
          } else if (data.action === 'sell' && data.qr_code) {
            setQrData(data.qr_code)
          } else {
            console.error('Unexpected QR verification response:', data)
            setError('Неожиданный ответ от сервера')
          }
        },
        onError: error => {
          console.error('QR verification failed:', error)
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
        onSuccess: () => {
          if (code) {
            checkQR({ code })
          }
        },
        onError: error => {
          console.error('QR sale failed:', error)
          setError('Ошибка при продаже QR кода')
        },
      },
    }
  )

  useEffect(() => {
    if (!code) return

    // ждем проверки авторизации
    if (!isAuthChecked) {
      return
    }

    // неавторизованный пользователь - используем паблик для редиректа
    if (!user && isAuthChecked && code) {
      setIsInitialized(true)
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
            window.location.href = data.redirect_url
          } else {
            setIsRedirecting(false)
            setError('Не удалось получить URL для перенаправления')
          }
        } catch (err) {
          console.error('Public redirect failed:', err)
          setIsRedirecting(false)
          setError('Ошибка при перенаправлении')
        }
      }
      redirectUser()
      return
    }

    // авторизованный пользователь - используем защищенный API
    if (user && isAuthChecked && code) {
      setIsInitialized(true)
      checkQR({ code })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, user, isAuthChecked])

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

  // начальное состояние - показываем загрузку до инициализации
  if (!isInitialized || isChecking || isSelling || isRedirecting) {
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
          <h1 className="mb-4 text-center text-2xl font-bold">Выдача QR кода</h1>

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

  // fallback состояние
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md rounded-lg bg-gray-50 p-6 text-center">
        <Loader />
      </div>
    </div>
  )
}

export default ActivationForm
