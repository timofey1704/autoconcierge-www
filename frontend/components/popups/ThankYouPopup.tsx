import React from 'react'
import { Dialog } from '../ui/Dialog'
import Image from 'next/image'
import CheckIcon from '../../public/icons/Check Circle Icon.svg'

interface ThankYouPopupProps {
  isOpen: boolean
  onClose: () => void
}

const ThankYouPopup: React.FC<ThankYouPopupProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      description={
        <>
          <div className="mb-6 flex justify-center">
            <Image src={CheckIcon} alt="success" width={64} height={64} />
          </div>
          <h3 className="mb-3 text-center">Заявка принята</h3>
          <p className="text-center text-base">
            Спасибо! Наш менеджер получил ваш номер и свяжется с вами в ближайшее время для
            консультации.
          </p>
        </>
      }
      showSubmit={true}
      showCancel={false}
      submitText="Хорошо"
    />
  )
}

export default ThankYouPopup
