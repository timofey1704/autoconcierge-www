import { useForm } from '@/app/hooks/useForm'
import UTextInput from '@/components/ui/UTextInput'
import showToast from '@/components/ui/showToast'
import useUserStore from '@/app/store/userStore'
import LocationSelect from '@/components/selectors/LocationSelector'

const validationRules = {
  firstName: { required: true },
  lastName: { required: false },
  phone_number: { required: true },
  email: { required: false },
  city: { required: false },
  address: { required: false },
  telegram_id: { required: false },
}

const PersonalInfo = () => {
  const { user, setUser } = useUserStore()

  const { values, handleChange, handleSubmit, FormProvider } = useForm(
    {
      firstName: user?.firstName || '',
      lastName: user?.surname || '',
      patronymic: user?.patronymic || '',
      phone_number: user?.phone_number || '',
      email: user?.email || '',
      city: typeof user?.city === 'object' ? user?.city : null,
      address: user?.address || '',
      telegram_id: user?.telegram_id || '',
    },
    validationRules,
    async values => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const response = await fetch(`${apiUrl}/account/change-profile-data/`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...values,
            city: values.city?.id || null,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Ошибка при обновлении данных')
        }

        const result = await response.json()
        setUser(result.user)
        showToast({ type: 'success', message: 'Данные успешно обновлены!' })
      } catch (error) {
        showToast({
          type: 'error',
          message: error instanceof Error ? error.message : 'Ой, что то пошло не так..',
        })
      }
    }
  )

  return (
    <FormProvider>
      <div className="space-y-3 py-3">
        <div className="overflow-hidden rounded-2xl pl-1">
          <div className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 pb-4 md:grid-cols-3">
                <UTextInput
                  name="firstName"
                  value={values.firstName}
                  handleChange={handleChange}
                  label="Имя"
                  placeholder="Иван"
                />
                <UTextInput
                  name="lastName"
                  value={values.lastName}
                  handleChange={handleChange}
                  label="Фамилия"
                  placeholder="Смирнов"
                />
                <UTextInput
                  name="patronymic"
                  value={values.patronymic}
                  handleChange={handleChange}
                  label="Отчество"
                  placeholder="Александрович"
                />

                <UTextInput
                  name="phone_number"
                  value={values.phone_number}
                  handleChange={handleChange}
                  label="Ваш номер телефона"
                />
                <UTextInput
                  name="email"
                  value={values.email}
                  handleChange={handleChange}
                  label="Email"
                  placeholder="Ваш email"
                />
                <UTextInput
                  name="telegram_id"
                  value={values.telegram_id}
                  handleChange={handleChange}
                  label="ID в Telegram"
                  placeholder="Ваш ID в Telegram"
                />
              </div>
              <div className="grid grid-cols-1 gap-6 pb-4 md:grid-cols-2">
                <LocationSelect
                  name="city"
                  value={values.city}
                  handleChange={handleChange}
                  label="Город"
                  placeholder="Ваш город проживания"
                />

                <UTextInput
                  name="address"
                  value={values.address}
                  handleChange={handleChange}
                  label="Адрес"
                  placeholder="Ваш адрес проживания"
                />
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-linear-to-r from-[#2A00D3] to-blue-700 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:cursor-pointer hover:from-[#2A00D3] hover:to-blue-800 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

export default PersonalInfo
