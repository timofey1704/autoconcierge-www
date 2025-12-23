'use client'

import { useState } from 'react'
import Scroll from '@/app/hooks/useScroll'

const Burger = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => setIsOpen(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 flex h-8 w-8 flex-col items-center justify-center"
      >
        <div className="relative h-8 w-8">
          <span
            className={`absolute h-0.5 bg-black transition-all duration-300 ease-in-out ${
              isOpen ? 'top-4 w-8 rotate-45' : 'top-2 w-8'
            }`}
          />
          <span
            className={`absolute h-0.5 bg-black transition-all duration-300 ease-in-out ${
              isOpen ? 'top-4 w-0 opacity-0' : 'top-4 w-8'
            }`}
          />
          <span
            className={`absolute h-0.5 bg-black transition-all duration-300 ease-in-out ${
              isOpen ? 'top-4 w-8 -rotate-45' : 'top-6 w-8'
            }`}
          />
        </div>
      </button>

      {/* меню */}
      <div
        className={`bg-light-gray fixed left-0 z-50 w-full origin-top shadow-lg transition-all duration-300 ease-in-out ${
          isOpen
            ? 'top-20 h-[calc(100vh-80px)] scale-y-100 opacity-100'
            : 'top-20 h-0 scale-y-0 opacity-0'
        } ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div
          className={`flex flex-col items-center space-y-8 pt-12 transition-all duration-300 ${
            isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <Scroll moveTo="services" className="internal-link" onClick={handleClose}>
            Услуги
          </Scroll>

          <Scroll moveTo="how-it-works" className="internal-link" onClick={handleClose}>
            Как это работает?
          </Scroll>

          <Scroll moveTo="pricing" className="internal-link" onClick={handleClose}>
            Тарифы
          </Scroll>

          <Scroll moveTo="faq" className="internal-link" onClick={handleClose}>
            FAQ
          </Scroll>
        </div>
      </div>
    </>
  )
}

export default Burger
