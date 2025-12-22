import { Membership } from '@/app/types'

interface PricingTabProps {
  memberships: Membership[]
  id: string
}

const PricingTab: React.FC<PricingTabProps> = ({ memberships, id }) => {
  return <div>PricingTab</div>
}

export default PricingTab
