import React from 'react'
import UButton from './ui/UButton'
import Link from 'next/link'
import UTextInput from './ui/UTextInput'
import UCheckbox from './ui/UCheckbox'

const GetSubscription = () => {
  return (
    <div id="get-subscription" className="relative w-full lg:w-216 xl:w-304 h-114 xl:h-[475px] rounded-[40px] overflow-hidden">
        <div className="absolute w-full h-full inset-0 bg-[url(/images/GetSubscriptionBackground.jpg)] bg-cover bg-no-repeat 
            bg-position-[50%_center] xl:bg-size-[162%] xl:bg-position-[43%_72%]" />

        <div className="absolute inset-0
            bg-[linear-gradient(90deg,rgba(14,17,13,0.9)_50%,rgba(14,17,13,0)_100%)]
            xl:bg-[linear-gradient(90deg,#0E110D_30%,rgba(14,17,13,0)_100%)]" />

        <div className="relative w-full h-full z-10 px-5 py-10 xl:px-15 xl:py-15">
            <h2 className="max-w-150">Оформите подписку прямо сейчас!</h2>
            <p className="w-78 xl:w-115 pt-[10px] xl:pt-5 pb-5 xl:pb-8">Оставьте заявку, и наш менеджер свяжется с вами для оформления договора в ближайшее время</p>
            <div className="w-full flex items-end flex-wrap gap-5 pb-5">
                <UTextInput
                    value=""
                    name="phone"
                    placeholder="+375 (___) _____-___-___"
                    label="Телефон"
                    className="phone-input"
                />
                <Link href="/protect-your-car">
                    <UButton text="Защитить автомобиль" className="min-w-75" />
                </Link>
            </div>
            <div className="w-70 md:w-full lg:w-full xl:w-full flex items-center gap-[10px]">
                <UCheckbox>
                    <span className="text-xs font-normal text-white">Ознакомлен (на) и согласен (на) на обработку моих <span className="underline underline-offset-2">персональных данных</span></span>
                </UCheckbox>
            </div>
        </div>
    </div>
  )
}

export default GetSubscription