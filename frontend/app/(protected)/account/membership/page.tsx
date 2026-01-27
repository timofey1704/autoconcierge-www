'use client'

import { useClientFetch } from '@/app/hooks/useClientFetch'
import PricingCard from './components/PricingCard'
import { Membership } from '@/app/types'
import Loader from '@/components/ui/Loader'

const PricingPage = () => {
  const {
    data: response,
    isLoading,
    error,
  } = useClientFetch<{ memberships: Membership[] }>('/main/get-memberships/')

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <div>Ошибка загрузки тарифных планов</div>
  }

  const memberships = response?.memberships || []

  return (
    <>
      <h1 className="text-[32px]!">Подписка</h1>
      {memberships.length === 0 ? (
        <div className="my-8 text-center text-gray-500">
          Раздел в стадии наполнения. Следите за обновлениями!
        </div>
      ) : (
        <PricingCard memberships={memberships} />
      )}
    </>
  )
}

export default PricingPage
