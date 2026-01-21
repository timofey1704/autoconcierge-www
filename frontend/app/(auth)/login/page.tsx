'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useUserStore from '@/app/store/userStore'
import Loader from '@/components/ui/Loader'
import { useForm } from '@/app/hooks/useForm'
import showToast from '@/components/ui/showToast'
import { signIn } from 'next-auth/react'
import UTextInput from '@/components/ui/UTextInput'
import Image from 'next/image'
import bgImage from '../../../public/images/auth/bg-image.png'
import bmw from '../../../public/images/auth/bmw.svg'

const validationRules = {
  email: { required: true },
  password: { required: true },
}

const LoginPage = () => {
  const router = useRouter()
  const { isAuthenticated } = useUserStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // проверяем логин
    if (isAuthenticated) {
      // распределяем
      router.replace('/account/profile')
      return
    }

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  const { values, isVisible, handleChange, handleSubmit, togglePasswordVisibility, FormProvider } =
    useForm(
      {
        email: '',
        password: '',
      },
      validationRules,
      async values => {
        try {
          const result = await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false,
          })

          if (result?.error) {
            showToast({ type: 'error', message: result.error })
            return
          }

          showToast({ type: 'success', message: 'Авторизация успешна!' })
          router.push('/account/profile')
        } catch {
          showToast({ type: 'error', message: 'Ошибка при входе в аккаунт' })
        }
      }
    )

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden from-gray-900 via-gray-800 to-gray-900 p-4">
      <Image src={bgImage} alt="bg" fill className="object-cover" />
      <FormProvider>
        <div className="z-10 w-full max-w-4xl">
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
                    label="Email"
                    name="email"
                    value={values.email}
                    handleChange={handleChange}
                  />
                  <UTextInput
                    label="Пароль"
                    name="password"
                    value={values.password}
                    handleChange={handleChange}
                    isPassword={true}
                    isVisible={isVisible}
                    togglePasswordVisibility={togglePasswordVisibility}
                  />
                </div>

                <div className="flex items-center justify-end">
                  <Link
                    href="/password-recovery"
                    className="text-sm text-blue-600 transition-colors duration-200 hover:text-blue-700 hover:underline"
                  >
                    Забыли пароль?
                  </Link>
                </div>

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
                    className="h-auto w-full object-contain drop-shadow-2xl"
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
                href="/register"
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
