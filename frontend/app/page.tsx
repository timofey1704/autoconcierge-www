import { getFAQs } from '@/lib/main/fetchFAQ'
import { getMemberships } from '@/lib/main/fetchMembershipData'
import FAQ from '@/components/FAQ'
import PricingTab from '@/components/PricingTab'
import AboutUs from '@/components/AboutUs'
import ProtectYourCar from '@/components/ProtectYourCar'
import GetSubscription from '@/components/GetSubscription'
import Services from '@/components/Services'
import HowItWorks from '@/components/HowItWorks'
import MainForm from '@/components/MainForm'

export default async function Home() {
  const [faqs, memberships] = await Promise.all([getFAQs(), getMemberships()])
  return (
    <div className="mx-auto flex flex-col items-center justify-center overflow-x-hidden">
      <MainForm />
      <div className="mx-auto flex w-full max-w-7xl flex-col space-y-32">
        <AboutUs />
        <Services id="services" />
        <HowItWorks id="how-it-works" />
        <ProtectYourCar />
        <GetSubscription />
        <FAQ faqs={faqs} id="faq" />
        <PricingTab memberships={memberships} id="pricing" />
      </div>
    </div>
  )
}
