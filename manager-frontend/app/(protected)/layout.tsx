'use client'

import { useEffect, Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import AccountSidebar from '@/components/AccountSidebar'
import Loader from '@/components/ui/Loader'
import useUserStore from '@/app/store/userStore'
import { getGreetingByTime } from '@/lib/getGreetingsByTime'

// !компонент для проверки аутентификации с доступом к searchParams
function AuthGuard() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { isAuthenticated, user } = useUserStore()

  useEffect(() => {
    if (!isAuthenticated || !user) {
      // cохраняем текущий URL для редиректа после логина
      const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
      const encodedCallback = encodeURIComponent(currentUrl)
      router.replace(`/login?callbackUrl=${encodedCallback}`)
    }
  }, [isAuthenticated, user, router, pathname, searchParams])

  return null
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useUserStore()

  // показываем лоадер пока не загружены данные менеджера
  if (!isAuthenticated || !user) {
    return <Loader />
  }

  const userNavigation = [
    { name: 'Главная', href: '/main', icon: 'main' },
    { name: 'Статистика', href: '/dashboard', icon: 'dashboard' },
  ]

  return (
    <>
      <Suspense fallback={null}>
        <AuthGuard />
      </Suspense>
      <Toaster />
      <div className="min-h-screen bg-[#F3F3F3]">
        <div className="mx-auto max-w-337.5 px-4 pt-8 sm:px-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="w-full shrink-0 md:w-64">
              <div className="sticky top-8">
                {user && <AccountSidebar user={user} navigation={userNavigation} />}
              </div>
            </div>
            <main className="min-w-0 flex-1 px-5">
              <h1 className="text-[32px]!">
                {getGreetingByTime()}, {user.name} {user.surname}
              </h1>
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
