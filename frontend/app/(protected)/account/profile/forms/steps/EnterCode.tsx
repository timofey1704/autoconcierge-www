import React from 'react'
import { useForm } from '@/app/hooks/useForm'
import UTextInput from '@/components/ui/UTextInput'
import showToast from '@/components/ui/showToast'
import { QRCodeData } from '@/app/types'

const validationRules = {
  code: { required: true },
}
interface ValidateCodeProps {
  onValidated: (data: QRCodeData) => void
}

const ValidateCode: React.FC<ValidateCodeProps> = ({ onValidated }) => {
  const { values, handleChange, handleSubmit, FormProvider } = useForm(
    { code: '' },
    validationRules,
    async values => {
      try {
        const response = await fetch('/api/account/profile/cars/validate-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: values.code }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Код не активен или уже использован')
        }

        const result = await response.json()
        showToast({ type: 'success', message: result.message })
        onValidated({
          code: result.code,
          imageURL: result.imageURL,
          isAlreadyVerificated: result.isAlreadyVerificated,
          listing_company: result.listing_company,
        })
      } catch (error) {
        showToast({
          type: 'error',
          message: error instanceof Error ? error.message : 'Ой, что то пошло не так..',
        })
      }
    }
  )

  return (
    <FormProvider>
      <div className="space-y-3 py-3">
        <div className="overflow-hidden rounded-2xl pl-1">
          <div className="space-y-4">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 px-0.5 pb-4 md:grid-cols-1">
                <UTextInput
                  name="code"
                  value={values.code}
                  handleChange={handleChange}
                  label="Код из конверта"
                  placeholder="Введите код из конверта"
                />
              </div>

              <div className="flex items-center justify-center">
                <button className="my-7 w-full rounded-xl bg-linear-to-r from-[#2A00D3] to-blue-700 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:cursor-pointer hover:from-[#2A00D3] hover:to-blue-800 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:scale-[0.98]">
                  Продолжить
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  )
}

export default ValidateCode
