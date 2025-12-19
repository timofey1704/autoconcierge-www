import React from 'react'
import Accordion from './ui/Accordion'
import { FAQProps } from '@/app/types'

const FAQ: React.FC<FAQProps> = ({ faqs, id }) => {
  if (!faqs || faqs.length === 0) {
    return null
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8" id={id}>
      <div className="py-12 sm:py-16 lg:py-20">
        <h5 className="gradient-line text-gradient">Часто задаваемые вопросы</h5>
        <div className="mt-4 mb-12 flex flex-col gap-6 sm:mb-16 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <h2 className="flex flex-col font-bold text-gray-900">
            <span>Всё, что вы хотели</span> знать о сервисе
          </h2>
          <div className="max-w-md text-sm text-gray-600 sm:text-lg lg:text-right">
            Если не нашли ответ на свой вопрос — всегда можно позвонить на{' '}
            <a href="tel:+375801100080" className="text-gradient font-semibold transition-colors">
              8 (801) 100-80-80
            </a>{' '}
            и проконсультироваться.
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map(faq => (
            <Accordion key={faq.id} title={faq.title} content={faq.content} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
