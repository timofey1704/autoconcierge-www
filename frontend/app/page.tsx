import { getFAQs } from '@/lib/main/fetchFAQ'
import { getMemberships } from '@/lib/main/fetchMembershipData'
import FAQ from '@/components/FAQ'
import UButton from '@/components/ui/UButton'
import UTextInput from '@/components/ui/UTextInput'
import ProtectYourCar from '@/components/ProtectYourCar'

export default async function Home() {
  const [faqs, memberships] = await Promise.all([getFAQs(), getMemberships()])
  return (
    <div className="mx-auto flex flex-col items-center justify-center space-y-24 overflow-x-hidden">
      <UButton text="Кнопка" />
      <UTextInput
        value=""
        name="qwe"
        placeholder="8 последних цифр"
        label="Название"
        helper_text="helper text"
      />
      <ProtectYourCar />
      <FAQ faqs={faqs} id="faq" />
    </div>
  )
}
