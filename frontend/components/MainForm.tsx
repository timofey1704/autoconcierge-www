'use client'

import Image from 'next/image'
import { useForm } from '@/app/hooks/useForm'
import UButton from './ui/UButton'
import UTextInput from './ui/UTextInput'
import UCheckbox from './ui/UCheckbox'
import CarImage from '../public/images/CarBackground.svg'
import CheckIcon from '../public/icons/Check Circle Icon.svg'
import { advantages } from '@/app/constants/advantages'
import Link from 'next/link'
import showToast from './ui/showToast'

const validationRules = {
  phone_number: { required: true },
  vin_code: { required: true },
  qr_code: { required: true },
  password: { required: true },
  privacy_policy: { required: true },
}

const MainForm = () => {
  const { values, handleChange, handleSubmit, FormProvider } = useForm(
    {
      phone_number: '',
      vin_code: '',
      qr_code: '',
      password: '',
      privacy_policy: false,
    },
    validationRules,
    async values => {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone_number: values.phone_number,
            vin_code: values.vin_code,
            qr_code: values.qr_code,
            password: values.password,
            privacy_policy: values.privacy_policy,
          }),
        })
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Ошибка при отправке данных')
        }
        showToast({ type: 'success', message: 'Заявка успешно создана!' })
      } catch (error) {
        showToast({
          type: 'error',
          message: error instanceof Error ? error.message : 'Ой, что то пошло не так..',
        })
      }
    }
  )

  return (
    <div className="relative mb-16 w-full sm:mb-20 lg:mb-24">
      <div className="absolute inset-0 z-0">
        <Image
          src={CarImage}
          alt="car"
          fill
          className="rounded-b-[40px] object-cover object-center"
          loading="eager"
        />
      </div>

      <div className="relative z-10 mx-auto mt-5 flex w-full max-w-7xl flex-col justify-between gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:gap-0 lg:px-8 lg:py-24">
        <div className="w-full lg:w-1/2 lg:pr-8">
          <h1 className="text-white">Круглосуточная помощь на дорогах по всей РБ</h1>
          <div className="mt-4 text-base text-white sm:text-lg">
            Вызовите эвакуатор или техпомощь за 1 звонок по единому номеру телефона 8 (801)
            100-80-80 и назовите последние 8 цифр VIN номера.
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:gap-4">
            {advantages.map(advantage => (
              <div key={advantage.id} className="flex items-center gap-3">
                <Image src={CheckIcon} alt={advantage.title} width={24} height={24} />
                <div className="text-sm text-white sm:text-base">{advantage.title}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full items-start justify-center lg:w-1/3">
          <FormProvider>
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-3 rounded-2xl border border-[#E7E7E7] bg-white/50 p-5 shadow-lg backdrop-blur-[10px] sm:gap-4 sm:p-6"
            >
              <h5 className="text-black">Активировать тариф</h5>
              <div className="text-xs text-gray-700 sm:text-sm">
                Наш оператор свяжется с вами в течение 5 минут
              </div>
              <UTextInput
                name="phone_number"
                placeholder="+375 (____) ________-_____-_____"
                label="Телефон"
                value={values.phone_number}
                handleChange={handleChange}
                className="w-full"
              />
              <UTextInput
                name="vin_code"
                placeholder="VIN номер лизингового автомобиля"
                label="VIN номер"
                value={values.vin_code}
                handleChange={handleChange}
                className="w-full"
              />
              <UTextInput
                name="qr_code"
                placeholder="Введите iD QR-кода"
                label="QR код"
                value={values.qr_code}
                handleChange={handleChange}
                className="w-full"
              />
              <UTextInput
                name="password"
                placeholder="Введите пароль"
                label="Пароль"
                value={values.password}
                handleChange={handleChange}
                className="w-full"
              />
              <UButton text="Защитить автомобиль" type="submit" className="w-full" />
              <UCheckbox
                name="privacy_policy"
                handleChange={handleChange}
                checked={Boolean(values.privacy_policy)}
                className="w-full"
              >
                <span className="text-xs font-normal text-gray-700">
                  Ознакомлен(а) и согласен(а) на обработку моих
                  <Link className="text-gradient ml-1 text-xs font-medium" href="/privacy-policy">
                    персональных данных
                  </Link>
                </span>
              </UCheckbox>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}

export default MainForm
