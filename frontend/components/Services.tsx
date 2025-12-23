import React from 'react'
import { ServicesData } from '@/app/constants/services'
import ServiceCard from './ServiceCard'

interface ServicesProps {
  id: string
}

const Services: React.FC<ServicesProps> = ({ id }) => {
  const EmptyCard = () => <div className="hidden lg:block lg:w-56.25 xl:w-72.25" />

  return (
    <section className="flex max-w-7xl flex-wrap justify-between gap-5 px-4 sm:px-6 lg:px-8" id={id}>
      <div className="lg:max-w-117 xl:max-w-149.5">
        <h5 className="gradient-line text-gradient">УСЛУГИ</h5>
        <div className="flex w-full flex-col pt-2.5">
          <h2 className="w-full text-black">Мы решим любую проблему на дороге</h2>
          <span className="text-4 text-dark-gray w-full pt-5 leading-7.5">
            Какая бы проблема ни возникла в пути, у нас есть готовое решение.
          </span>
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
    </section>
  )
}

export default Services
