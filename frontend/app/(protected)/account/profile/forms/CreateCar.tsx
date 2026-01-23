import React from 'react'

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
  return <div>CreateCar</div>
}

export default CreateCar
