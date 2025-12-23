import { Membership } from '@/app/types'
import PricingCard from './PricingCard'

interface PricingTabProps {
  memberships: Membership[]
  id: string
}

const PricingTab: React.FC<PricingTabProps> = ({ memberships }) => {
  return (
    <div className="max-w-7xl flex flex-col lg:flex-row gap-5 xl:pt-[15px] px-4 sm:px-6 lg:px-8">
        <div className="w-full lg:max-w-117 xl:max-w-[289px]">
            <h5 className="gradient-line text-gradient">Тарифы</h5>
            <div className="w-full flex flex-col pt-[10px]">
                <h2 className="w-full text-black">Пакеты услуг</h2>
                <span className="w-full pt-5 text-4 leading-[30px] text-dark-gray">От базовой помощи до максимального комфорта в любой ситуации.</span>
            </div>
        </div>
        <PricingCard memberships={memberships} />
          {/* {memberships.map(membership => (
          // Логику отрисовки перенести в PricingCard, передав memberships и там создать div grid и заполнять
            <PricingCard 
          ))} */}
        {/* {ServicesData.slice(0, 2).map(item => (
            <ServiceCard 
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                icon={item.icon}
            />
        ))} */}
    </div>

    // <div className="pricing">
    //   {memberships.map(item => (
    //     <div key={item.id}>
    //       {item.plan} {item.price} {item.features.map(feature => (
    //         <div key={feature.id}>{feature.name}</div>
    //       ))}
    //     </div>
    //   ))}
    // </div>
  )
}

export default PricingTab
