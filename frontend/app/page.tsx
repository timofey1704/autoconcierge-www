import { getFAQs } from '@/lib/main/fetchFAQ'
import { getMemberships } from '@/lib/main/fetchMembershipData'
import FAQ from '@/components/FAQ'
import PricingTab from '@/components/PricingTab'
import { AboutUsData } from './constants/aboutUs'
import AboutUsCard from '@/components/AboutUsCard'
import ProtectYourCar from '@/components/ProtectYourCar'
import GetSubscription from '@/components/GetSubscription'
import Services from '@/components/Services'
import HowItWorks from '@/components/HowItWorks'

export default async function Home() {
  const [faqs, memberships] = await Promise.all([getFAQs(), getMemberships()])
  return (
    <div className="mx-auto flex flex-col items-center justify-center space-y-32 overflow-x-hidden">
      {/* about us */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8" id="about-us">
        <h5 className="gradient-line text-gradient">НАШЕ ДЕЛО</h5>
        <div className="mt-4 mb-12 flex flex-col gap-6 sm:mb-16 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <h2 className="flex w-2/3 flex-col font-bold text-gray-900">
            СБЛ-Лизинг — надежный партнер для технической помощи на дорогах для водителей.
          </h2>
          <div className="mt-auto flex max-w-md text-sm text-gray-600 sm:text-lg lg:text-right">
            Мы работаем круглосуточно, чтобы вы были спокойны за свой автомобиль в любой ситуации.
            Наша команда профессиональных мастеров на выезде быстро придет на помощь и решит
            проблему.
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

      <Services />
      <HowItWorks />
      <ProtectYourCar />
      <GetSubscription />
      <FAQ faqs={faqs} id="faq" />
      <PricingTab memberships={memberships} id="pricing" />
    </div>
  )
}
