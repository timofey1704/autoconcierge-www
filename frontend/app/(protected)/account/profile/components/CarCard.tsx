import React from 'react'
import Image from 'next/image'
import { Car } from '@/app/types'
import { getProxiedImageUrl } from '@/lib/utils/imageProxy'

interface CarCardProps {
  car: Car
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md md:p-6">
      <h4 className="mb-4">
        {car.brand} {car.model}
      </h4>
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
