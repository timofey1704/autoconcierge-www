'use client'

import { Dialog } from '@/components/ui/Dialog'
import { generateTrackingId } from '../utils/generate-tracking-id'
import { convertPriceToCents, getDisplayPlanName } from '../utils/converters'
import showToast from '@/components/ui/showToast'
import { Membership } from '@/app/types'
import useUserStore from '@/app/store/userStore'
import { formatDateTime, ACTIVATION_DATE_ISO } from '@/lib/utils/dateFormatter'

interface SubmitPopupProps {
  membership: Membership
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const SubmitPopup = ({ membership, onClose }: SubmitPopupProps) => {
  const { user } = useUserStore()

  const changeAccountType = async (membership: Membership) => {
    // проверка наличия и валидности email
    if (!user?.email || !user.email.trim()) {
      showToast({
        type: 'error',
        message: 'Для оформления подписки необходимо указать email в профиле',
      })
      return
    }

    // простая проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(user.email)) {
      showToast({
        type: 'error',
        message: 'Некорректный формат email. Пожалуйста, проверьте email в профиле',
      })
      return
    }

    // используем account_type напрямую, он уже содержит внутреннее значение
    const internalPlan = membership.account_type

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

    const requestBody = {
      plan: internalPlan,
      amount: amountInCents,
      description: `Оплата подписки Autoconcierge - ${getDisplayPlanName(internalPlan)} на 1 месяц`,
      tracking_id: generateTrackingId(),
      email: user?.email,
    }

    const response = await fetch('/api/account/payments', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Response error:', errorData)
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
          <p>Дата активации: {formatDateTime(ACTIVATION_DATE_ISO)}</p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => changeAccountType(membership)}
              className="flex-1 rounded-xl bg-linear-to-r from-[#2A00D3] to-blue-700 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:cursor-pointer hover:from-[#2A00D3] hover:to-blue-800 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
            >
              Подтвердить
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border-2 border-gray-300 py-3 text-base font-semibold text-gray-700 transition-all duration-200 hover:cursor-pointer hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
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
