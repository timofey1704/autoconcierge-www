'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import useUserStore from '../store/userStore'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession()
  const { setUser, setAuthenticated } = useUserStore()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.accessToken) {
        setUser(null)
        setAuthenticated(false)
        return
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL

      try {
        const response = await fetch(`${API_URL}/user/`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error(`Error fetching user data: ${response.status} ${errorText}`)
        }

        const userData = await response.json()

        setUser({
          id: userData.id,
          uuid: userData.uuid,
          firstName: userData.firstName,
          surname: userData.surname,
          account_type: userData.account_type,
        })
        setAuthenticated(true)
      } catch (error) {
        console.error('Error in fetchUserData:', error)
      }
    }

    fetchUserData()
  }, [session, setUser, setAuthenticated])

  return <>{children}</>
}
