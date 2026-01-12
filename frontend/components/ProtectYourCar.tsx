import UButton from './ui/UButton'
import Scroll from '@/app/hooks/useScroll'

const ProtectYourCar = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[40px] md:w-180 lg:w-240 xl:h-108 xl:w-304">
        <div className="absolute inset-0 h-full bg-[url(/images/ProtectYourCarBackground.jpg)] bg-cover bg-no-repeat sm:bg-size-[150%] sm:bg-position-[5%_45%]" />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0E110D_40%,rgba(14,17,13,0)_100%)] xl:bg-[linear-gradient(90deg,#0E110D_25%,rgba(14,17,13,0)_100%)]" />

        <div className="relative z-10 h-full px-4 py-10 sm:px-6 lg:px-8 xl:py-20">
          <h3 className="w-full xl:w-150 text-white">Защитите свой автомобиль от непредвиденных ситуаций!</h3>
          <p className="w-full pt-2.5 pb-5 text-white sm:w-78 md:w-100 lg:w-150 xl:pt-5">
            Оформите подписку АвтоКонсьерж и будьте уверены в завтрашнем дне. Полный спектр услуг
            помощи на дороге 24/7
          </p>
          <Scroll moveTo="get-subscription">
            <UButton text="Защитить автомобиль" className="w-full lg:w-68.5" />
          </Scroll>
        </div>
      </div>
    </div>
  )
}

export default ProtectYourCar
