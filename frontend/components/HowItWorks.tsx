import Image from "next/image"
import CallIcon from '../public/icons/Сall.svg'
import NameYourVINIcon from '../public/icons/NameYourVIN.svg'
import GetHelpIcon from '../public/icons/GetHelp.svg'
import VectorIcon from '../public/icons/Vector.svg'
import VectorSMIcon from '../public/icons/VectorSM.svg'

const HowItWorks = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
        <h5 className="gradient-line text-gradient">КАК ЭТО РАБОТАЕТ?</h5>
        <div className="flex flex-col items-end lg:flex-row pt-[10px] pb-10 lg:pb-15">
            <h2 className="w-full lg:max-w-140 xl:max-w-175 text-black">3 простых шага чтобы защитить себя</h2>
            <span className="w-full lg:max-w-100 xl:max-w-129 pt-5 lg:pt-0 text-4 leading-[30px] lg:text-right text-dark-gray">Просто выполните эти три простых шага для быстрого решения любой проблемы</span>
        </div>
        <div className="w-full flex flex-col lg:flex-row lg:flex-nowrap items-center lg:items-start justify-center">
            <div className="w-58 flex flex-col items-center">
                <Image src={CallIcon} width={78} height={78} alt="Позвоните" className="xl:w-[106px] xl:h-[106px]" />
                <h5 className="pt-[10px] pb-[10px] xl:pt-5 text-center text-black">Позвоните</h5>
                <span className="text-4 leading-7 text-dark-gray text-center">Позвоните по единому номеру 8 (801) 100-80-80</span>
            </div>

            <div className="py-5">
                <Image src={VectorSMIcon} width={40} height={100} alt="" className="w-10 h-25 block lg:hidden" />
                <Image src={VectorIcon} width={40} height={100} alt="" className="w-65 h-[62px] hidden lg:block" />
            </div>
            

            <div className="w-58 flex flex-col items-center">
                <Image src={NameYourVINIcon} width={78} height={78} alt="Назовите VIN" className="xl:w-[106px] xl:h-[106px]" />
                <h5 className="pt-[10px] pb-[10px] xl:pt-5 text-center text-black">Назовите VIN</h5>
                <span className="text-4 leading-7 text-dark-gray text-center">Назовите 8 последних цифр VIN номера</span>
            </div>

            <div className="py-5">
                <Image src={VectorSMIcon} width={40} height={100} alt="" className="w-10 h-25 block lg:hidden" />
                <Image src={VectorIcon} width={40} height={100} alt="" className="w-65 h-[62px] hidden lg:block lg:-scale-x-100" />
            </div>
            

            <div className="w-58 flex flex-col items-center">
                <Image src={GetHelpIcon} width={78} height={78} alt="Получите помощь" className="xl:w-[106px] xl:h-[106px]" />
                <h5 className="pt-[10px] pb-[10px] xl:pt-5 text-center text-black">Получите помощь</h5>
                <span className="text-4 leading-7 text-dark-gray text-center">Выезд мастера в течение ~45 минут</span>
            </div>
        </div>
    </div>
  )
}

export default HowItWorks