import { getFAQs } from '@/lib/main/fetchFAQ'
import { getMemberships } from '@/lib/main/fetchMembershipData'
import FAQ from '@/components/FAQ'
import PricingTab from '@/components/PricingTab'

export default async function Home() {
  const [faqs, memberships] = await Promise.all([getFAQs(), getMemberships()])
  return (
    <div className="mx-auto flex flex-col items-center justify-center space-y-24 overflow-x-hidden">
      <FAQ faqs={faqs} id="faq" />
      <PricingTab memberships={memberships} id="pricing" />
    </div>
  )
}
