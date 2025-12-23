import { ServicesData } from "@/app/constants/services"
import ServiceCard from "./ServiceCard"

const Services = () => {
    const EmptyCard = () => <div className="hidden lg:block lg:w-[225px] xl:w-[289px]" />

  return (
    <div className="max-w-7xl flex flex-wrap justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <div className="lg:max-w-117 xl:max-w-[598px]">
            <h5 className="gradient-line text-gradient">УСЛУГИ</h5>
            <div className="w-full flex flex-col pt-[10px]">
                <h2 className="w-full text-black">Мы решим любую проблему на дороге</h2>
                <span className="w-full pt-5 text-4 leading-[30px] text-dark-gray">Какая бы проблема ни возникла в пути, у нас есть готовое решение.</span>
            </div>
        </div>
        {ServicesData.slice(0, 2).map(item => (
            <ServiceCard 
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                icon={item.icon}
            />
        ))}

        {[...ServicesData.slice(2, 5), null].map((item, index) =>
            item ? (
                <ServiceCard 
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                />
            ) : (
                <EmptyCard key={`empty-${index}`} />
            )
        )}

        {[null, ...ServicesData.slice(5, 8)].map((item, index) =>
            item ? (
                <ServiceCard 
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    description={item.description}
                    icon={item.icon}
                />
            ) : (
                <EmptyCard key={`empty-${index}`} />
            )
        )}
    </div>
  )
}

export default Services