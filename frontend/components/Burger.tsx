'use client'

import Scroll from '@/app/hooks/useScroll'
import Link from 'next/link'

interface BurgerProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const Burger = ({ isOpen, setIsOpen }: BurgerProps) => {
  const handleClose = () => setIsOpen(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 flex h-8 w-8 flex-col items-center justify-center"
      >
        <div className="relative h-8 w-8">
          <span
            className={`absolute h-0.5 transition-all duration-300 ease-in-out ${
              isOpen ? 'top-4 w-8 rotate-45 bg-black' : 'top-2 w-8 bg-white'
            }`}
          />
          <span
            className={`absolute h-0.5 transition-all duration-300 ease-in-out ${
              isOpen ? 'top-4 w-0 bg-black opacity-0' : 'top-4 w-8 bg-white'
            }`}
          />
          <span
            className={`absolute h-0.5 transition-all duration-300 ease-in-out ${
              isOpen ? 'top-4 w-8 -rotate-45 bg-black' : 'top-6 w-8 bg-white'
            }`}
          />
        </div>
      </button>

      {/* меню */}
      <div
        className={`bg-light-gray fixed left-0 z-40 w-full origin-top shadow-lg transition-all duration-300 ease-in-out ${
          isOpen
            ? 'top-20 h-[calc(100vh-60px)] scale-y-100 opacity-100'
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
          <Link href="login">Вход</Link>
          <a
            href="https://manager.ids-help.by/login"
            className="external-link text-black"
            draggable={false}
          >
            Менеджер
          </a>
        </div>
      </div>
    </>
  )
}

export default Burger
