import React from 'react'
import UButton from './ui/UButton'
import Link from 'next/link'

const ProtectYourCar = () => {
  return (
    <div className="relative w-full xl:w-304 h-102 xl:h-108 rounded-[40px] overflow-hidden">
        <div className="absolute w-full h-full inset-0 bg-[url(/images/ProtectYourCarBackground.jpg)] bg-cover bg-no-repeat xl:bg-size-[150%] xl:bg-position-[5%_45%]" />

        <div className="absolute inset-0
            bg-[linear-gradient(90deg,#0E110D_40%,rgba(14,17,13,0)_100%)]
            xl:bg-[linear-gradient(90deg,#0E110D_10%,rgba(14,17,13,0)_100%)]" />

        <div className="relative z-10 px-5 py-10 xl:px-15 xl:py-20">
            <h2>Защитите свой автомобиль от непредвиденных ситуаций!</h2>
            <p className="w-78 xl:w-150 pt-[10px] xl:pt-5 pb-5">Оформите подписку АвтоКонсьерж и будьте уверены в завтрашнем дне. Полный спектр услуг помощи на дороге 24/7</p>
            <Link href="#get-subscription">
                <UButton text="Защитить автомобиль" className="max-w-75" />
            </Link>
        </div>
    </div>
  )
}

export default ProtectYourCar