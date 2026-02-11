'use client'

import { useEffect, useState, Suspense, useCallback } from 'react'
import PersonalInfo from './forms/PersonalInfo'
import ExistedCars from './forms/ExistedCars'
import CreateCar from './forms/CreateCar'
import { useTabs } from '@/app/hooks/useTabs'
import { TabsContainer, TabConfig } from '@/components/ui/TabsContainer'
import { useSearchParams } from 'next/navigation'
import Loader from '@/components/ui/Loader'
import { Car } from '@/app/types'
import useUserStore from '@/app/store/userStore'
import { getGreetingByTime } from '@/lib/utils/getGreetingsByTime'

type TabType = 'contacts' | 'cars'

const TABS: TabConfig<TabType>[] = [
  {
    id: 'contacts',
    label: 'Контактные данные',
    mobileLabel: 'Контакты',
  },
  {
    id: 'cars',
    label: 'Данные об автомобиле',
    mobileLabel: 'Автомобили',
  },
]

const ProfilePage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [hasCars, setHasCars] = useState(true) // отслеживаем наличие машин
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab') as TabType
  const { user } = useUserStore()

  const { selectedTab, indicatorStyle, refs, handleTabChange } = useTabs<TabType>(
    ['contacts', 'cars'],
    { defaultTab: tabFromUrl || 'contacts' }
  )

  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== selectedTab) {
      handleTabChange(tabFromUrl)
    }
  }, [tabFromUrl, selectedTab, handleTabChange])

  // обработчик загрузки машин
  const handleCarsLoad = useCallback((cars: Car[]) => {
    setHasCars(cars.length > 0)
  }, [])

  // определяем текст кнопки в зависимости от контекста
  const getButtonText = () => {
    if (showCreateForm) {
      return hasCars ? 'Ваши авто' : 'Отменить'
    }
    return 'Добавить автомобиль'
  }

  const userName = `${user?.firstName ?? ''} ${user?.surname ?? ''}`.trim() || 'Пользователь'

  return (
    <Suspense fallback={<Loader />}>
      <div>
        <h1 className="text-[32px]!">
          {getGreetingByTime()}, {userName}
        </h1>
        <TabsContainer
          tabs={TABS}
          selectedTab={selectedTab}
          indicatorStyle={indicatorStyle}
          refs={refs}
          onTabChange={handleTabChange}
          rightContent={
            selectedTab === 'cars' && (
              <span
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="mr-4 cursor-pointer hover:text-blue-700"
              >
                {getButtonText()}
              </span>
            )
          }
        />
        {selectedTab === 'contacts' ? (
          <PersonalInfo />
        ) : showCreateForm ? (
          <CreateCar onClose={() => setShowCreateForm(false)} />
        ) : (
          <ExistedCars
            onOpenCreateForm={() => setShowCreateForm(true)}
            onCarsLoad={handleCarsLoad}
          />
        )}
      </div>
    </Suspense>
  )
}

export default ProfilePage
