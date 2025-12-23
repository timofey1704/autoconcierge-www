import { PricingCardProps } from '@/app/types'
import Image from 'next/image'
import React from 'react'
import CheckCircleIcon from '@/public/icons/CheckCircle.svg'

const PricingCard: React.FC<PricingCardProps> = ({ memberships }) => {
  return(
    <div className="grid gap-5">
      {memberships.map(membership => (
        <div key={membership.id} className="w-[289px] h-[610px] flex flex-col items-start rounded-[20px] bg-light-gray px-5 py-15 shadow-lg transition-shadow hover:shadow-xl">
          {membership.is_popular && (
            <div className="w-[169px] h-[30px] px-5 py-[5px] text-center z-index-10">
              <p>Рекомендуем</p>
            </div>
          )}
          <div className="w-full flex justify-between">
            <h5 className="text-black">{membership.plan}</h5>
            <h5 className="text-dark-gray">{membership.price}</h5>
          </div>
          <p className="py-5 text-dark-gray">{membership.description}</p>
          <div className="flex flex-col gap-[10px]">
            {membership.features.map(feature => (
               <div key={feature.id} className="flex gap-[10px]">
                <Image src={CheckCircleIcon} width={16} height={16} alt="" />
                <p>{feature.name}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PricingCard
