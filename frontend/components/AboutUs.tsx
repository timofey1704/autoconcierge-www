import AboutUsCard from './AboutUsCard'
import { AboutUsData } from '@/app/constants/aboutUs'

const AboutUs = () => {
  return (
    <section id="about-us" className="px-4 sm:px-6 lg:px-8">
      <h5 className="gradient-line text-gradient">НАШЕ ДЕЛО</h5>
      <div className="mt-4 mb-12 flex flex-col gap-6 sm:mb-16 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <h2 className="flex w-2/3 flex-col font-bold text-gray-900">
          IDS-HELP — надежный партнер для технической помощи на дорогах для водителей.
        </h2>
        <div className="mt-auto flex max-w-md text-sm text-gray-600 sm:text-lg lg:text-right">
          Мы работаем круглосуточно, чтобы вы были спокойны за свой автомобиль в любой ситуации.
          Наша команда профессиональных мастеров на выезде быстро придет на помощь и решит проблему.
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {AboutUsData.map(item => (
          <AboutUsCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </section>
  )
}

export default AboutUs
