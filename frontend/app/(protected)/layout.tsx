'use client'

import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import AccountSidebar from '@/components/AccountSidebar'
import Loader from '@/components/ui/Loader'
import useUserStore from '@/app/store/userStore'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, user } = useUserStore()

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.replace('/login')
    }
  }, [isAuthenticated, user, router])

  // показываем лоадер пока не загружены данные менеджера
  if (!isAuthenticated || !user) {
    return <Loader />
  }

  const userNavigation = [
    { name: 'Профиль', href: '/account/profile', icon: 'profile' },

    { name: 'Подписка', href: '/account/membership', icon: 'membership' },
  ]

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-[#F3F3F3]">
        <div className="mx-auto max-w-337.5 px-4 pt-8 sm:px-6">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="w-full shrink-0 md:w-64">
              <div className="sticky top-8">
                {user && <AccountSidebar user={user} navigation={userNavigation} />}
              </div>
            </div>
            <main className="min-w-0 flex-1 px-5">{children}</main>
          </div>
        </div>
      </div>
    </>
  )
}
