import UButton from './ui/UButton'
import Scroll from '@/app/hooks/useScroll'

const ProtectYourCar = () => {
  return (
    <div className="relative h-102 w-full overflow-hidden rounded-[40px] lg:w-216 xl:h-108 xl:w-304">
      <div className="absolute inset-0 h-full w-full bg-[url(/images/ProtectYourCarBackground.jpg)] bg-cover bg-no-repeat xl:bg-size-[150%] xl:bg-position-[5%_45%]" />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,#0E110D_40%,rgba(14,17,13,0)_100%)] xl:bg-[linear-gradient(90deg,#0E110D_25%,rgba(14,17,13,0)_100%)]" />

      <div className="relative z-10 h-full w-full px-5 py-10 xl:px-15 xl:py-20">
        <h2 className="text-white">Защитите свой автомобиль от непредвиденных ситуаций!</h2>
        <p className="w-78 pt-2.5 pb-5 text-white xl:w-150 xl:pt-5">
          Оформите подписку АвтоКонсьерж и будьте уверены в завтрашнем дне. Полный спектр услуг
          помощи на дороге 24/7
        </p>
        <Scroll moveTo="get-subscription">
          <UButton text="Защитить автомобиль" className="max-w-75" />
        </Scroll>
      </div>
    </div>
  )
}

export default ProtectYourCar
