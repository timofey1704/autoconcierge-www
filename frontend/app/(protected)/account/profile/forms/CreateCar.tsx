import React, { useState } from 'react'
import EnterCode from './steps/EnterCode'
import CreateCarForm from './steps/CreateCarForm'
import ValidateCode from './steps/ValidateCode'
import StepIndicator from '@/components/ui/StepIndicator'

interface QRCodeData {
  code: string
  imageURL: string
  isAlreadyVerificated?: boolean
}

interface CreateCarFormProps {
  onClose: () => void
}

type Step = 'enter' | 'validate' | 'create'

const CreateCar: React.FC<CreateCarFormProps> = ({ onClose }) => {
  const [step, setStep] = useState<Step>('enter')
  const [qrData, setQRData] = useState<QRCodeData | null>(null)

  const steps: Array<{ id: number; name: string; status: 'current' | 'complete' | 'upcoming' }> = [
    {
      id: 1,
      name: 'Код из конверта',
      status: step === 'enter' ? 'current' : 'complete',
    },
    {
      id: 2,
      name: 'Проверяем код',
      status: step === 'validate' ? 'current' : step === 'enter' ? 'upcoming' : 'complete',
    },
    {
      id: 3,
      name: 'Создаем авто',
      status: step === 'create' ? 'current' : 'upcoming',
    },
  ]

  const handleEnterStep = (data: QRCodeData) => {
    setQRData(data)
    // eсли код уже верифицирован, пропускаем шаг валидации
    setStep(data.isAlreadyVerificated ? 'create' : 'validate')
  }

  const handleValidateStep = () => {
    setStep('create')
  }

  return (
    <div className="space-y-8 py-3">
      <div className="p-4">
        <StepIndicator steps={steps} />
      </div>
      <div className="space-y-3">
        {step === 'enter' && <EnterCode onValidated={handleEnterStep} />}
        {step === 'validate' && qrData && (
          <ValidateCode code={qrData.code} onValidated={handleValidateStep} />
        )}
        {step === 'create' && qrData && <CreateCarForm onClose={onClose} initialQRData={qrData} />}
      </div>
    </div>
  )
}

export default CreateCar
