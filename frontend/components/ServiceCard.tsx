import Image from "next/image"

interface CardProps {
  id: number
  title: string 
  description: string
  icon: string
}

const ServiceCard: React.FC<CardProps> = ({ title, description, icon }) => {
  return (
    <div className="w-full md:w-[350px] lg:w-[225px] lg:h-72 xl:w-[289px] xl:h-74 flex flex-col items-start rounded-3xl bg-light-gray p-5 shadow-lg transition-shadow hover:shadow-xl">
        <Image src={icon} width={72} height={72} alt="" />
        <h5 className="pt-5 pb-[10px] text-black">{title}</h5>
        <span className="text-4 leading-7 text-dark-gray">{description}</span>
    </div>
  )
}

export default ServiceCard