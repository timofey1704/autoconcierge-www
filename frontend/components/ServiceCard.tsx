import Image from 'next/image'

interface CardProps {
  id: number
  title: string
  description: string
  icon: string
}

const ServiceCard: React.FC<CardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-light-gray flex w-full flex-col items-start rounded-3xl p-5 shadow-lg transition-shadow duration-300 hover:cursor-pointer hover:shadow-xl md:w-87.5 lg:h-72 lg:w-56.25 xl:h-74 xl:w-72.25">
      <Image src={icon} width={72} height={72} alt="" />
      <h5 className="pt-5 pb-2.5 text-black">{title}</h5>
      <span className="text-4 text-dark-gray leading-7">{description}</span>
    </div>
  )
}

export default ServiceCard
