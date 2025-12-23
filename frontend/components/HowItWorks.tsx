import Image from 'next/image'
import CallIcon from '../public/icons/Call.svg'
import NameYourVINIcon from '../public/icons/NameYourVIN.svg'
import GetHelpIcon from '../public/icons/GetHelp.svg'
import VectorIcon from '../public/icons/Vector.svg'
import VectorSMIcon from '../public/icons/VectorSM.svg'

const HowItWorks = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h5 className="gradient-line text-gradient">КАК ЭТО РАБОТАЕТ?</h5>
      <div className="flex flex-col items-end pt-2.5 pb-10 lg:flex-row lg:pb-15">
        <h2 className="w-full text-black lg:max-w-140 xl:max-w-175">
          3 простых шага чтобы защитить себя
        </h2>
        <span className="text-4 text-dark-gray w-full pt-5 leading-7.5 lg:max-w-100 lg:pt-0 lg:text-right xl:max-w-129">
          Просто выполните эти три простых шага для быстрого решения любой проблемы
        </span>
      </div>
      <div className="flex w-full flex-col items-center justify-center lg:flex-row lg:flex-nowrap lg:items-start">
        <div className="flex w-58 flex-col items-center">
          <Image
            src={CallIcon}
            width={78}
            height={78}
            alt="Позвоните"
            className="xl:h-26.5 xl:w-26.5"
          />
          <h5 className="pt-2.5 pb-2.5 text-center text-black xl:pt-5">Позвоните</h5>
          <span className="text-4 text-dark-gray text-center leading-7">
            Позвоните по единому номеру <a href="tel:88011008080"> 8 (801) 100-80-80</a>
          </span>
        </div>

        <div className="py-5">
          <Image
            src={VectorSMIcon}
            width={40}
            height={100}
            alt=""
            className="block h-25 w-10 lg:hidden"
          />
          <Image
            src={VectorIcon}
            width={40}
            height={100}
            alt=""
            className="hidden h-15.5 w-65 lg:block"
          />
        </div>

        <div className="flex w-58 flex-col items-center">
          <Image
            src={NameYourVINIcon}
            width={78}
            height={78}
            alt="Назовите VIN"
            className="xl:h-26.5 xl:w-26.5"
          />
          <h5 className="pt-2.5 pb-2.5 text-center text-black xl:pt-5">Назовите VIN</h5>
          <span className="text-4 text-dark-gray text-center leading-7">
            Назовите 8 последних цифр VIN номера
          </span>
        </div>

        <div className="py-5">
          <Image
            src={VectorSMIcon}
            width={40}
            height={100}
            alt=""
            className="block h-25 w-10 lg:hidden"
          />
          <Image
            src={VectorIcon}
            width={40}
            height={100}
            alt=""
            className="hidden h-15.5 w-65 lg:block lg:-scale-x-100"
          />
        </div>

        <div className="flex w-58 flex-col items-center">
          <Image
            src={GetHelpIcon}
            width={78}
            height={78}
            alt="Получите помощь"
            className="xl:h-26.5 xl:w-26.5"
          />
          <h5 className="pt-2.5 pb-2.5 text-center text-black xl:pt-5">Получите помощь</h5>
          <span className="text-4 text-dark-gray text-center leading-7">
            Выезд мастера в течение ~45 минут
          </span>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks
