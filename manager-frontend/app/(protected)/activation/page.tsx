'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import Loader from '@/components/ui/Loader'

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

const VerifyPage = () => {
  const params = useSearchParams()
  const code = params.get('ref')
  const [qrData, setQrData] = useState<QRData | null>(null)
  const [error, setError] = useState<string>('')

  // проверяем QR код
  const { mutate: checkQR, isLoading: isChecking } = useClientFetch<QRCheckResponse, QRPayload>(
    '/account/verify-qr/',
    {
      method: 'POST',
      mutationOptions: {
        onSuccess: data => {
          if (data.action === 'redirect' && data.redirect_url) {
            // редиректим на сайт партнера
            window.location.href = data.redirect_url
          } else if (data.action === 'sell' && data.qr_code) {
            // показываем QR для продажи
            setQrData(data.qr_code)
          }
        },
        onError: error => {
          setError('Ошибка при проверке QR кода')
        },
      },
    }
  )

  // продаем QR кода
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
    if (code) {
      // проверяем QR код при загрузке страницы
      checkQR({ code })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

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

  if (isChecking || isSelling) return <Loader />

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
              <Image src={qrData.imageURL} alt="QR код" className="h-64 w-64 object-contain" />
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

  return null
}

export default VerifyPage
