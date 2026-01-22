import { useRouter } from 'next/navigation'
import UButton from './ui/UButton'
import { IoExitOutline } from 'react-icons/io5'
import useUserStore from '@/app/store/userStore'

const Logout = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // бекенд чистит куки
      await fetch(`${API_URL}/auth/logout/`, {
        method: 'POST',
        credentials: 'include',
      })

      // чистим стор
      useUserStore.getState().logout()

      // редирект
      router.push('/')
      router.refresh() // обновляем страницу чтобы обновить стейты
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
