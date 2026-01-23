import { useEffect } from 'react'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import { Car } from '@/app/types'
import Loader from '@/components/ui/Loader'
import CarCard from '../components/CarCard'

interface ExistedCarsProps {
  onOpenCreateForm: () => void
  onCarsLoad: (cars: Car[]) => void
}

const ExistedCars = ({ onOpenCreateForm, onCarsLoad }: ExistedCarsProps) => {
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useClientFetch<{ cars: Car[] }>('/account/cars/')

  const cars = response?.cars || []

  // уведомляем родителя о загрузке машин
  useEffect(() => {
    if (response?.cars) {
      onCarsLoad(response.cars)
    }
  }, [response, onCarsLoad])

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <div>Ошибка загрузки данных об автомобилях</div>
  }

  if (cars.length === 0) {
    return (
      <div className="my-8 space-y-3 rounded-lg bg-white px-2 py-10 text-center">
        <h2 className="text-2xl!">У вас пока нет добавленных автомобилей</h2>
        <button
          onClick={onOpenCreateForm}
          className="w-full rounded-xl bg-linear-to-r from-blue-700 to-blue-800 px-6 py-3 text-base whitespace-nowrap text-white shadow-lg transition-all duration-200 hover:cursor-pointer hover:from-blue-800 hover:to-blue-900 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:scale-[0.98] md:mx-0 md:w-1/4 md:px-4 md:py-2.5"
        >
          Добавить автомобиль
        </button>
      </div>
    )
  }

  return <CarCard cars={cars} />
}

export default ExistedCars
