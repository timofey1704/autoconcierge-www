import React from 'react'
import Image from 'next/image'
import { Car } from '@/app/types'
import { getProxiedImageUrl } from '@/lib/utils/imageProxy'
import EditIcon from '@/public/icons/ProfileEdit.svg'
import DeleteIcon from '@/public/icons/ProfileDelete.svg'

interface CarCardProps {
  car: Car
  onEdit: (carId: number) => void
  onDelete: (carId: number) => void
  isDeleting: boolean
}

const CarCard: React.FC<CarCardProps> = ({ car, onEdit, onDelete, isDeleting }) => {

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md md:p-6 relative">
      {isDeleting && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-2xl z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            <span className="text-sm text-gray-600">Удаление...</span>
          </div>
        </div>
      )}
      
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900">
          {car.brand} {car.model}
        </h4>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(car.id)}
            disabled={isDeleting}
            className="cursor-pointer transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Редактировать"
          >
            <Image src={EditIcon} alt="Edit" width={24} height={24} className="md:h-8 md:w-8" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(car.id)}
            disabled={isDeleting}
            className="cursor-pointer transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Удалить"
          >
            <Image
              src={DeleteIcon}
              alt="Delete"
              width={24}
              height={24}
              className="md:h-8 md:w-8"
            />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <div className="flex shrink-0 flex-row items-center justify-around gap-3 md:flex-col md:gap-4">
          <div className="flex w-32 items-center justify-center md:w-40">
            <Image
              src={getProxiedImageUrl(car.image) || '/images/no-car.svg'}
              alt={`${car.brand} ${car.model}`}
              height={160}
              width={160}
              className="aspect-square rounded-2xl object-cover"
            />
          </div>

          <div className="flex flex-col items-center gap-1 md:gap-2">
            <Image
              src={getProxiedImageUrl(car.qr_image)}
              alt="QR Code"
              width={102}
              height={102}
              className="h-24 w-24 rounded-md object-contain md:h-25.5 md:w-25.5"
            />
            <div className="flex items-center justify-center rounded-lg bg-gray-100 px-3 py-1.5 md:px-5 md:py-2">
              <span className="text-[10px] font-semibold text-gray-700 md:text-[12px]">
                {car.qr_code}
              </span>
            </div>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-2">
          <div>
            <p className="text-gray-500">Марка</p>
            <p className="font-semibold text-gray-900">{car.brand}</p>
          </div>

          <div>
            <p className="text-gray-500">Модель</p>
            <p className="font-semibold text-gray-900">{car.model}</p>
          </div>

          <div>
            <p className="text-gray-500">Кузов</p>
            <p className="font-semibold text-gray-900">{car.body_type}</p>
          </div>

          <div>
            <p className="text-gray-500">Год выпуска</p>
            <p className="font-semibold text-gray-900">{car.year_built}</p>
          </div>

          <div>
            <p className="text-gray-500">Цвет</p>
            <p className="font-semibold text-gray-900">{car.color}</p>
          </div>

          <div>
            <p className="text-gray-500">VIN код</p>
            <p className="font-semibold text-gray-900">{car.vin_code}</p>
          </div>

          <div>
            <p className="text-gray-500">Номерной знак</p>
            <p className="font-semibold text-gray-900">{car.licence_plate}</p>
          </div>

          <div>
            <p className="text-gray-500">Лизинговая компания</p>
            <p className="font-semibold text-gray-900">{car.lising_company}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarCard
