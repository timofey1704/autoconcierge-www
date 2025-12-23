import { PricingCardProps } from '@/app/types'
import Image from 'next/image'
import React from 'react'
import CheckCircleIcon from '@/public/icons/CheckCircle.svg'

const PricingCard: React.FC<PricingCardProps> = ({ memberships }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
            className={`relative flex min-h-125 w-full flex-col items-start rounded-[20px] px-5 py-12 shadow-lg transition-shadow hover:shadow-xl sm:py-15 ${bgClass}`}
          >
            {membership.is_popular && (
              <div className="bg-color-gradient absolute top-0 left-1/2 z-10 flex h-7.5 w-[80%] max-w-52.25 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[10px] px-5 py-1.25">
                <p className="text-sm font-medium sm:text-base">Рекомендуем</p>
              </div>
            )}

            <div className="flex w-full items-baseline justify-between gap-2">
              <h5 className={`${headingColor} flex-1`}>{membership.plan}</h5>
              <h5 className={`${headingColor} whitespace-nowrap`}>{membership.price}</h5>
            </div>

            <p className={`py-4 text-sm sm:py-5 sm:text-base ${textColor}`}>
              {membership.description}
            </p>

            <div className="flex w-full flex-1 flex-col gap-3 sm:gap-2.5">
              {membership.features.map(feature => (
                <div key={feature.id} className="flex items-start gap-2 sm:gap-2.5">
                  <Image
                    src={CheckCircleIcon}
                    width={16}
                    height={16}
                    alt=""
                    className="mt-0.5 shrink-0"
                  />
                  <p className={`text-sm sm:text-base ${textColor}`}>{feature.name}</p>
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
