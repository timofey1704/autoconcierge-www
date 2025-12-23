'use client'

import { PricingCardProps } from '@/app/types'
import React from 'react'

const PricingCard: React.FC<PricingCardProps> = ({ memberships }) => {
  return(
    <div className="w-[289px] h-[610px] flex flex-col items-start rounded-[20px] bg-light-gray px-5 py-15 shadow-lg transition-shadow hover:shadow-xl">
      {/* <h5 className="text-black">{title}</h5> */}
        {/* <Image src={icon} width={72} height={72} alt="" /> */}
        {/* <h5 className="pt-5 pb-[10px] text-black">{title}</h5>
        <span className="text-4 leading-7 text-dark-gray">{description}</span> */}
    </div>
  )
}

export default PricingCard
