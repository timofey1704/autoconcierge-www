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
    <div id="get-subscription" className="mx-auto mb-10 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative h-120 overflow-hidden rounded-[40px] md:w-180 lg:w-240 xl:h-118.75 xl:w-304">
        <div className="absolute inset-0 h-full w-full bg-[url(/images/GetSubscriptionBackground.jpg)] bg-cover bg-position-[50%_center] bg-no-repeat xl:bg-size-[162%] xl:bg-position-[43%_72%]" />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,17,13,0.9)_50%,rgba(14,17,13,0)_100%)] xl:bg-[linear-gradient(90deg,#0E110D_30%,rgba(14,17,13,0)_100%)]" />

        <div className="relative z-10 flex h-full w-full flex-col justify-start px-4 py-10 sm:px-6 md:px-15 md:py-15">
          <FormProvider>
            <form className="h-full w-full" onSubmit={handleSubmit}>
              <h3 className="max-w-150 text-white">Оформите подписку прямо сейчас!</h3>
              <p className="w-full pt-2.5 pb-5 text-white sm:w-78 xl:w-115 xl:pt-5 xl:pb-8">
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
                  className="w-full lg:w-1/4"
                  labelClassName="text-white"
                />

                <UButton text="Защитить автомобиль" className="w-full lg:w-1/4" type="submit" />
              </div>
              <div className="flex w-full items-center gap-2.5 sm:w-56 md:w-full">
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
      </div>
    </div>
  )
}

export default GetSubscription
