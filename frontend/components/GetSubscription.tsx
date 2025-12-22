'use client'

import UButton from './ui/UButton'
import Link from 'next/link'
import UTextInput from './ui/UTextInput'
import UCheckbox from './ui/UCheckbox'
import { useForm } from '@/app/hooks/useForm'
import showToast from './ui/showToast'

const validationRules = {
  phone_number: { required: true },
  privacy_policy: { required: true },
}

const GetSubscription = () => {
  const { values, handleChange, handleSubmit, FormProvider, resetField } = useForm(
    {
      phone_number: '',
      privacy_policy: false,
    },
    validationRules,
    async values => {
      try {
        // без privacy_policy
        const { privacy_policy, ...dataToSend } = values

        const response = await fetch('/api/main/send-lead', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Ошибка при отправке данных')
        }

        showToast({ type: 'success', message: 'Заявка успешно создана!' })

        resetField('phone_number', '')
        resetField('privacy_policy', false)
      } catch (error) {
        showToast({
          type: 'error',
          message: error instanceof Error ? error.message : 'Ой, что то пошло не так..',
        })
      }
    }
  )

  return (
    <div
      id="get-subscription"
      className="relative h-114 w-full overflow-hidden rounded-[40px] lg:w-216 xl:h-118.75 xl:w-304"
    >
      <div className="absolute inset-0 h-full w-full bg-[url(/images/GetSubscriptionBackground.jpg)] bg-cover bg-position-[50%_center] bg-no-repeat xl:bg-size-[162%] xl:bg-position-[43%_72%]" />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,17,13,0.9)_50%,rgba(14,17,13,0)_100%)] xl:bg-[linear-gradient(90deg,#0E110D_30%,rgba(14,17,13,0)_100%)]" />
      <FormProvider>
        <form
          className="relative z-10 h-full w-full px-5 py-10 xl:px-15 xl:py-15"
          onSubmit={handleSubmit}
        >
          <h2 className="max-w-150 text-white">Оформите подписку прямо сейчас!</h2>
          <p className="w-78 pt-2.5 pb-5 text-white xl:w-115 xl:pt-5 xl:pb-8">
            Оставьте заявку, и наш менеджер свяжется с вами для оформления договора в ближайшее
            время
          </p>
          <div className="flex w-full flex-wrap items-end gap-5 pb-5">
            <UTextInput
              name="phone_number"
              placeholder="+375 (___) _____-___-___"
              label="Телефон"
              value={values.phone_number}
              handleChange={handleChange}
              className="phone-input"
            />

            <UButton text="Защитить автомобиль" className="min-w-75" type="submit" />
          </div>
          <div className="flex w-70 items-center gap-2.5 md:w-full lg:w-full xl:w-full">
            <UCheckbox
              name="privacy_policy"
              handleChange={handleChange}
              checked={Boolean(values.privacy_policy)}
            >
              <span className="text-xs font-normal text-white">
                Ознакомлен (на) и согласен (на) на обработку моих
                <Link className="text-gradient ml-1 text-xs" href="/privacy-policy">
                  персональных данных
                </Link>
              </span>
            </UCheckbox>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default GetSubscription
