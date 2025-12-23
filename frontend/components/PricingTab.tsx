import { Membership } from '@/app/types'

interface PricingTabProps {
  memberships: Membership[]
  id: string
}

const PricingTab: React.FC<PricingTabProps> = ({ memberships }) => {
  return <div>PricingTab</div>
}

export default PricingTab
