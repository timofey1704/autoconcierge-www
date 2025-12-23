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
    <div className="mb-24 w-full">
      <Image src={CarImage} alt="car" className="w-full" loading="eager" />

      <div className="mx-auto flex w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* preferences */}
        <div className="w-1/2">
          <h1 className="text-white">Круглосуточная помощь на дорогах по всей РБ</h1>
          <div className="text-white">
            Вызовите эвакуатор или техпомощь за 1 звонок по единому номеру телефона 8 (801)
            100-80-80 и назовите последние 8 цифр VIN номера.
          </div>
          <div className="flex flex-col gap-4">
            {advantages.map(advantage => (
              <div key={advantage.id} className="flex items-center gap-2">
                <Image src={CheckIcon} alt={advantage.title} />
                <div>{advantage.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* form */}
        <div className="flex w-1/3 items-center justify-center">
          <FormProvider>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 rounded-2xl bg-gray-500 p-4"
            >
              <h5>Активировать тариф</h5>
              <div className="text-dark-gray text-sm">
                Наш оператор свяжется свами в течении 5 минут
              </div>
              <UTextInput
                name="phone_number"
                placeholder="+375 (____) ________-_____-_____"
                label="Телефон"
                value={values.phone_number}
                handleChange={handleChange}
                className="phone-input"
              />
              <UTextInput
                name="vin_code"
                placeholder="VIN номер лизингового автомобиля"
                label="VIN номер"
                value={values.vin_code}
                handleChange={handleChange}
                className="phone-input"
              />
              <UTextInput
                name="qr_code"
                placeholder="Введите iD QR-кода"
                label="QR код"
                value={values.qr_code}
                handleChange={handleChange}
                className="phone-input"
              />
              <UTextInput
                name="password"
                placeholder="Введите пароль"
                label="Пароль"
                value={values.password}
                handleChange={handleChange}
                className="phone-input"
              />
              <UButton text="Защитить автомобиль" className="min-w-75" type="submit" />
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
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}

export default MainForm
