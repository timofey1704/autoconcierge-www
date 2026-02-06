'use client'

import { useMemo } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { generateTrackingId } from '../utils/generate-tracking-id'
import { convertPriceToCents, getDisplayPlanName } from '../utils/converters'
import showToast from '@/components/ui/showToast'
import { Membership } from '@/app/types'
import { displayNameToAccountType } from '@/app/constants/accountTypes'
import useUserStore from '@/app/store/userStore'
import { formatDateTime } from '@/lib/utils/dateFormatter'

interface SubmitPopupProps {
  membership: Membership
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const SubmitPopup = ({ membership, onClose }: SubmitPopupProps) => {
  const { user } = useUserStore()

  const activationDate = useMemo(() => {
    const HOUR = 60 * 60 * 1000
    return new Date(Math.ceil((Date.now() + 24 * 60 * 60 * 1000) / HOUR) * HOUR).toISOString()
  }, [])

  const changeAccountType = async (membership: Membership) => {
    const internalPlan = displayNameToAccountType[membership.plan]
    if (!internalPlan) {
      showToast({
        type: 'error',
        message: 'Неверный план подписки',
      })
      return
    }

    // проверка наличия цены
    if (!membership.price) {
      showToast({
        type: 'error',
        message: 'Цена подписки не указана',
      })
      return
    }

    //препроцессинг для бипейда
    const amountInCents = convertPriceToCents(membership.price)

    const response = await fetch('/api/account/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan: internalPlan,
        amount: amountInCents,
        description: `Оплата подписки Autoconcierge - ${getDisplayPlanName(internalPlan)} на 1 месяц`,
        tracking_id: generateTrackingId(),
        email: user?.email,
      }),
    })

    if (!response.ok) {
      showToast({
        type: 'error',
        message: 'Не смогли изменить план',
      })
      return
    }

    const responseData = await response.json()

    // для платных планов проверяем наличие URL для редиректа
    if (responseData.checkoutUrl) {
      // перенаправляем пользователя на страницу оплаты
      window.location.href = responseData.checkoutUrl
    } else {
      showToast({
        type: 'error',
        message: 'Не удалось получить ссылку на оплату',
      })
    }
  }

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      title="Ваша подписка вступает в силу завтра!"
      description={
        <div className="space-y-4">
          <p className="">
            Все операции в сервисе фиксируются с точностью до часа. С этого момента и до активации
            вашей подписки в течение 24 часов проходит технический мораторий. Это означает, что
            любые события с автомобилем, произошедшие в этот промежуток, не покрываются услугами
            автоконсьержа.
          </p>
          <p>Дата активации: {formatDateTime(activationDate)}</p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => changeAccountType(membership)}
              className="flex-1 rounded-xl bg-linear-to-r from-[#2A00D3] to-blue-700 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:from-[#2A00D3] hover:to-blue-800 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
            >
              Подтвердить
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-gray-300 py-3 text-base font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
            >
              Отмена
            </button>
          </div>
        </div>
      }
      showSubmit={false}
      showCancel={false}
    />
  )
}

export default SubmitPopup
