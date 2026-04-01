'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useUserStore from '@/app/store/userStore'
import Loader from '@/components/ui/Loader'
import { useForm } from '@/app/hooks/useForm'
import showToast from '@/components/ui/showToast'
import UTextInput from '@/components/ui/UTextInput'
import Image from 'next/image'
import bgImage from '../../../../public/images/auth/bg-image.jpg'
import bmw from '../../../../public/images/auth/manager_login_cab.jpg'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import type { User } from '@/app/types'
import type { AxiosError } from 'axios'

const validationRules = {
  email: { required: true, minLength: 13 },
  password: { required: true },
}

type LoginPayload = { email: string; password: string }
type LoginResponse = { message: string; user: User }

const LoginForm = () => {
  const router = useRouter()
  const { user, isAuthChecked, setUser } = useUserStore()
  const searchParams = useSearchParams()

  // получаем URL для редиректа после логина
  const callbackUrl = searchParams.get('callbackUrl') || '/main'

  const { mutate: login, isLoading: isLoggingIn } = useClientFetch<
    LoginResponse,
    LoginPayload,
    AxiosError<{ error?: string }>
  >('/auth/login/manager/', {
    method: 'POST',
    mutationOptions: {
      onSuccess: data => {
        setUser(data.user)
        router.replace(decodeURIComponent(callbackUrl))
      },
      onError: error => {
        const message = error.response?.data?.error ?? 'Ошибка при входе'
        showToast({ type: 'error', message })
      },
    },
  })

  useEffect(() => {
    if (!isAuthChecked) return
    if (user) router.replace(decodeURIComponent(callbackUrl))
  }, [isAuthChecked, user, router])

  if (!isAuthChecked) {
    return <Loader />
  }

  // уже залогинен — редирект в аккаунт, не показываем форму
  if (user) {
    return <Loader />
  }

  const { values, isVisible, handleChange, handleSubmit, togglePasswordVisibility, FormProvider } =
    useForm(
      {
        email: '',
        password: '',
      },
      validationRules,
      async values => {
        login(values)
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
                  <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                    Кабинет менеджера
                  </h1>
                  <p className="text-sm text-gray-600 md:text-base">
                    Войдите в свой аккаунт, чтобы продолжить
                  </p>
                </div>

                <div className="space-y-4">
                  <UTextInput
                    label="Email"
                    name="email"
                    value={values.email}
                    handleChange={handleChange}
                    placeholder="Ваш email"
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
                  disabled={isLoggingIn}
                  className="w-full rounded-xl bg-linear-to-r from-blue-600 to-blue-700 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:cursor-pointer hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
                >
                  {isLoggingIn ? 'Вход...' : 'Войти'}
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
          </form>
        </div>
      </FormProvider>
    </div>
  )
}

export default LoginForm
