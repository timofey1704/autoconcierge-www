'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog } from '@/components/ui/Dialog'
import questionIcon from '../../../../public/icons/question.svg'
import { knowledgeBase } from '@/app/constants/knowledgeBase'

const KnowledgeBase = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<string>('')

  const handleOpen = (question: string) => {
    setSelectedQuestion(question)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setSelectedQuestion('')
  }
  return (
    <div className="my-5 flex flex-col gap-4 rounded-xl bg-black p-4 shadow md:flex-row">
      <div className="mb-0 w-full space-y-4 text-white md:mb-5 md:w-[60%]">
        <h2 className="text-2xl!">База знаний менеджера</h2>
        <div className="text-base">
          Всё для эффективной работы: от сканирования QR-кода до работы с клиентами в личном
          кабинете.
        </div>
      </div>

      <div className="h-0.5 w-full bg-gray-600 md:h-auto md:w-0.5" />

      <div className="flex flex-col justify-around space-y-2 text-white [&_h3]:text-base! [&_h3]:font-normal!">
        {knowledgeBase.map(item => (
          <h3 key={item.id} className="flex items-center gap-2">
            {item.title}
            <Image
              src={questionIcon}
              alt="question"
              width={16}
              height={16}
              className="cursor-pointer transition-transform hover:scale-110"
              onClick={() => handleOpen(item.title)}
            />
          </h3>
        ))}
      </div>
      <Dialog
        isOpen={isOpen}
        onClose={handleClose}
        title={selectedQuestion}
        description={knowledgeBase.find(item => item.title === selectedQuestion)?.content || ''}
        showCancel={false}
        submitText="Понятно"
      />
    </div>
  )
}

export default KnowledgeBase
