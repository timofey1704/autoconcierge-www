import { Membership } from '@/app/types'
import PricingCard from './PricingCard'

interface PricingTabProps {
  memberships: Membership[]
  id: string
}

const PricingTab: React.FC<PricingTabProps> = ({ memberships, id }) => {
  return (
    <section
      className="mx-auto mb-40 flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:gap-5 lg:px-8"
      id={id}
    >
      <div className="mr-10 w-full lg:w-auto lg:shrink-0">
        <h5 className="gradient-line text-gradient uppercase">Тарифы</h5>
        <div className="mt-4 flex flex-col gap-4">
          <h2 className="text-black">Пакеты услуг</h2>
          <p className="text-dark-gray text-base sm:text-lg lg:max-w-xs">
            От базовой помощи до максимального комфорта в любой ситуации.
          </p>
        </div>
      </div>
      <PricingCard memberships={memberships} />
    </section>
  )
}

export default PricingTab
