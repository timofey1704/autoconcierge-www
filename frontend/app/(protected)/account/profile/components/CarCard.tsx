import React from 'react'
import { Car } from '@/app/types'

interface CarCardProps {
  cars: Car[]
}

const CarCard: React.FC<CarCardProps> = ({ cars }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cars.map(car => (
        <div key={car.id}>{car.brand}</div>
      ))}
    </div>
  )
}

export default CarCard
