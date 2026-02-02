import { useEffect, useState } from 'react'
import { useClientFetch } from '@/app/hooks/useClientFetch'
import { Car } from '@/app/types'
import Loader from '@/components/ui/Loader'
import CarCard from '../components/CarCard'
import EditPopup from '../components/EditPopup'
import showToast from '@/components/ui/showToast'

interface ExistedCarsProps {
  onOpenCreateForm: () => void
  onCarsLoad: (cars: Car[]) => void
}

const ExistedCars = ({ onOpenCreateForm, onCarsLoad }: ExistedCarsProps) => {
  const { data: cars, isLoading, error, refetch } = useClientFetch<Car[]>('/account/cars/')
  const [deletingCarId, setDeletingCarId] = useState<number | null>(null)
  const [editingCar, setEditingCar] = useState<Car | null>(null)

  // уведомляем родителя о загрузке машин
  useEffect(() => {
    if (cars && cars.length > 0) {
      onCarsLoad(cars)
    }
  }, [cars, onCarsLoad])

  const handleEdit = (carId: number) => {
    const car = cars?.find(c => c.id === carId)
    if (car) {
      setEditingCar(car)
    }
  }

  const handleCloseEditPopup = () => {
    setEditingCar(null)
  }

  const handleEditSuccess = async () => {
    showToast({ type: 'success', message: 'Автомобиль успешно обновлен' })
    setEditingCar(null)
    // обновляем список автомобилей
    await refetch()
  }

  const handleDelete = async (carId: number) => {
    try {
      setDeletingCarId(carId)

      const response = await fetch('/api/account/profile/cars/delete', {
        method: 'PATCH',
        body: JSON.stringify({ id: carId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Ошибка при удалении автомобиля')
      }

      showToast({ type: 'success', message: 'Автомобиль успешно удален' })

      // обновляем список автомобилей
      await refetch()
    } catch (error) {
      showToast({
        type: 'error',
        message: error instanceof Error ? error.message : 'Не удалось удалить автомобиль',
      })
    } finally {
      setDeletingCarId(null)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  if (error) {
    return <div>Ошибка загрузки данных об автомобилях</div>
  }

  return (
    <>
      {!cars || cars.length === 0 ? (
        <div className="my-8 space-y-3 rounded-lg bg-white px-2 py-10 text-center">
          <h2 className="text-2xl!">У вас пока нет добавленных автомобилей</h2>
          <button
            onClick={onOpenCreateForm}
            className="w-full rounded-xl bg-linear-to-r from-blue-700 to-blue-800 px-6 py-3 text-base whitespace-nowrap text-white shadow-lg transition-all duration-200 hover:cursor-pointer hover:from-blue-800 hover:to-blue-900 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:scale-[0.98] md:mx-0 md:w-1/4 md:px-4 md:py-2.5"
          >
            Добавить автомобиль
          </button>
        </div>
      ) : (
        <div className="my-4 space-y-4">
          {cars?.map(car => (
            <CarCard
              key={car.id}
              car={car}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={deletingCarId === car.id}
            />
          ))}
        </div>
      )}

      {editingCar && (
        <EditPopup car={editingCar} onClose={handleCloseEditPopup} onSuccess={handleEditSuccess} />
      )}
    </>
  )
}

export default ExistedCars
