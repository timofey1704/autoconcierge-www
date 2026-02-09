import { useRouter } from 'next/navigation'
import { IoExitOutline } from 'react-icons/io5'
import useUserStore from '@/app/store/userStore'
import { signOut } from 'next-auth/react'

const Logout = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout/`, {
        method: 'POST',
        credentials: 'include',
      })

      await signOut({ redirect: false })

      useUserStore.getState().logout()

      router.replace('/main')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center rounded-lg p-4 text-sm font-medium text-gray-600 transition-all duration-200 hover:cursor-pointer hover:bg-gray-100"
    >
      <IoExitOutline className="mr-2 h-5 w-5" />
      Выйти из аккаунта
    </button>
  )
}

export default Logout
