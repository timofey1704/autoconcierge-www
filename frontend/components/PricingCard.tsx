import { PricingCardProps } from '@/app/types'
import Image from 'next/image'
import React from 'react'
import CheckCircleIcon from '@/public/icons/CheckCircle.svg'

const PricingCard: React.FC<PricingCardProps> = ({ memberships }) => {
  return(
    <div className="grid gap-5">
      {memberships.map((membership, index) => {
        const bgClass =
          index === 0
            ? 'bg-light-gray'
            : index === 1
            ? 'bg-[url(/images/PricingCardMediumBackground.svg)] bg-cover bg-center'
            : 'bg-[url(/images/PricingCardPremiumBackground.svg)] bg-cover bg-center'

        const headingColor = index === 0 ? 'text-black' : 'text-white'
        const textColor = index === 0 ? 'text-dark-gray' : 'text-white'

        return (
          <div
            key={membership.id}
            className={`w-[289px] h-[610px] flex flex-col items-start rounded-[20px] px-5 py-15 shadow-lg transition-shadow hover:shadow-xl ${bgClass}`}
          >
            {membership.is_popular && (
              <div 
                className="
                  absolute 
                  flex items-center justify-center 
                  top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                  w-[209px] h-[30px] 
                  px-5 py-[5px] 
                  z-10 
                  rounded-[10px]
                  bg-color-gradient"
              >
                <p>Рекомендуем</p>
              </div>
            )}

            <div className="w-full flex justify-between">
              <h5 className={headingColor}>{membership.plan}</h5>
              <h5 className={headingColor}>{membership.price}</h5>
            </div>

            <p className={`py-5 ${textColor}`}>{membership.description}</p>

            <div className="flex flex-col gap-[10px]">
              {membership.features.map(feature => (
                <div key={feature.id} className="flex gap-[10px]">
                  <Image src={CheckCircleIcon} width={16} height={16} alt="" />
                  <p className={textColor}>{feature.name}</p>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PricingCard
