import { useClientFetch } from '@/app/hooks/useClientFetch'
import { Car } from '@/app/types'

const ExistedCars = () => {
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useClientFetch<{ cars: Car[] }>('/account/cars/')

  const cars = response?.cars || []
  console.log(cars)

  return <div>ExistedCars</div>
}

export default ExistedCars
