import React from 'react'
import Image from 'next/image'
import { PricingCardProps } from '@/app/types'
import CheckCircleIcon from '@/public/icons/CheckCircle.svg'
import { formatDate } from '@/lib/utils/dateFormatter'

const PricingCard: React.FC<PricingCardProps> = ({ memberships }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {memberships.map((membership, index) => {
        const bgClass = index === 0 ? 'bg-light-gray' : index === 1 ? 'bg-light-gray' : 'bg-black'

        const headingColor = index <= 1 ? 'text-black' : 'text-white'
        const textColor = index <= 1 ? 'text-dark-gray' : 'text-white'

        const formattedDate = formatDate(membership.actual_before)
        const recommendedTextColor = index <= 1 ? 'text-blue-700' : 'text-blue-400'

        return (
          <div
            key={membership.id}
            className={`relative flex min-h-125 w-full flex-col items-start rounded-4xl px-5 pt-16 shadow-lg transition-shadow hover:shadow-xl sm:pt-17 ${bgClass}`}
          >
            {formattedDate && (
              <p
                className={`absolute top-5 left-5 text-sm! font-medium text-blue-700 sm:text-base`}
              >
                Активна до: {formattedDate}
              </p>
            )}

            {membership.is_recommended && (
              <p
                className={`absolute left-5 text-sm! font-medium ${recommendedTextColor} sm:text-base ${
                  formattedDate ? 'top-10 sm:top-10' : 'top-5'
                }`}
              >
                Рекомендуем
              </p>
            )}

            <div className="flex w-full flex-col gap-2">
              <h5 className={`${headingColor} flex-1 text-[20px]!`}>{membership.plan}</h5>
              <h5 className={`${headingColor} text-[40px]! whitespace-nowrap`}>
                {membership.price} <span className={`${headingColor} text-xl!`}>BYN / месяц</span>
              </h5>
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
                  <p className={`text-sm! sm:text-base! ${textColor}`}>{feature.name}</p>
                </div>
              ))}
            </div>
            {membership.actual_before ? null : (
              <button className="my-7 w-full rounded-xl bg-linear-to-r from-[#2A00D3] to-blue-700 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:cursor-pointer hover:from-[#2A00D3] hover:to-blue-800 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:scale-[0.98]">
                Оформить подписку
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default PricingCard
