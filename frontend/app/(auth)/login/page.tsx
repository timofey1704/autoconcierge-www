'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useUserStore from '@/app/store/userStore'
import Loader from '@/components/ui/Loader'
import { useForm } from '@/app/hooks/useForm'
import showToast from '@/components/ui/showToast'
import UTextInput from '@/components/ui/UTextInput'
import Image from 'next/image'
import bgImage from '../../../public/images/auth/bg-image.jpg'
import bmw from '../../../public/images/auth/bmw.jpg'

const validationRules = {
  phone_number: { required: true, minLength: 13 },
  password: { required: true },
}

const LoginPage = () => {
  const router = useRouter()
  const { user, isAuthChecked } = useUserStore()
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (!isAuthChecked) return

    if (user) {
      router.replace('/account/profile')
    }
  }, [isAuthChecked, user])

  if (!isAuthChecked) {
    return <Loader />
  }

  const { values, isVisible, handleChange, handleSubmit, togglePasswordVisibility, FormProvider } =
    useForm(
      {
        phone_number: '',
        password: '',
      },
      validationRules,
      async values => {
        try {
          const loginRes = await fetch(`${API_URL}/auth/login/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(values),
          })

          if (!loginRes.ok) {
            const error = await loginRes.json()
            showToast({ type: 'error', message: error.error })
            return
          }

          const userRes = await fetch(`${API_URL}/auth/user/`, {
            credentials: 'include',
          })

          const user = await userRes.json()
          useUserStore.getState().setUser(user)

          showToast({ type: 'success', message: 'Авторизация успешна!' })
          router.replace('/account/profile')
        } catch {
          showToast({ type: 'error', message: 'Ошибка при входе в аккаунт' })
        }
      }
    )

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden from-gray-900 via-gray-800 to-gray-900">
      <Image src={bgImage} alt="bg" fill className="object-cover" />
      <FormProvider>
        <div className="z-10 w-full max-w-4xl p-4">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8 rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm md:p-12"
          >
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Добро пожаловать</h1>
                  <p className="text-sm text-gray-600 md:text-base">
                    Войдите в свой аккаунт, чтобы продолжить
                  </p>
                </div>

                <div className="space-y-4">
                  <UTextInput
                    label="Номер телефона"
                    name="phone_number"
                    value={values.phone_number}
                    handleChange={handleChange}
                    placeholder="Ваш номер телефона"
                  />
                  <UTextInput
                    label="Пароль"
                    name="password"
                    value={values.password}
                    handleChange={handleChange}
                    isPassword={true}
                    isVisible={isVisible}
                    togglePasswordVisibility={togglePasswordVisibility}
                    placeholder="Ваш пароль"
                  />
                </div>

                {/* <div className="flex items-center justify-end">
                  <Link
                    href="/password-recovery"
                    className="text-sm text-blue-600 transition-colors duration-200 hover:text-blue-700 hover:underline"
                  >
                    Забыли пароль?
                  </Link>
                </div> */}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-linear-to-r from-blue-600 to-blue-700 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:cursor-pointer hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
                >
                  Войти
                </button>
              </div>

              <div className="hidden items-center justify-center md:flex md:flex-1">
                <div className="relative h-full w-full">
                  <Image
                    src={bmw}
                    alt="bmw"
                    className="h-auto w-full rounded-2xl object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-gray-300" />
              <span className="shrink-0 text-sm text-gray-500">или</span>
              <div className="flex-1 border-t border-gray-300" />
            </div>

            <div className="text-center text-sm md:text-base">
              <span className="text-gray-600">Впервые у нас? </span>
              <Link
                href="/"
                className="font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-700 hover:underline"
              >
                Зарегистрироваться
              </Link>
            </div>
          </form>
        </div>
      </FormProvider>
    </div>
  )
}

export default LoginPage
