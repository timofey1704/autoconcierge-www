'use client'

import Link from 'next/link'
import Burger from './Burger'
import Scroll from '@/app/hooks/useScroll'
import { useState } from 'react'
import IDSLogoWhite from '../public/icons/IDSLogoWhite.svg'
import IDSLogoBlack from '../public/icons/IDSLogoBlack.svg'
import PhoneIcon from '../public/icons/telephone.svg'
import Image from 'next/image'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={`relative z-50 pt-4 transition-colors duration-300 md:pt-6 ${isOpen ? 'bg-light-gray' : 'bg-gray'}`}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between py-4">
          <div>
            <Link
              href="/"
              className="flex items-baseline gap-2 transition-opacity duration-300 hover:cursor-pointer hover:opacity-80"
              draggable={false}
            >
              <Image
                src={isOpen ? IDSLogoBlack : IDSLogoWhite}
                width={106}
                height={40}
                alt="IDS"
                priority
                draggable={false}
                quality={100}
                unoptimized={true}
              />
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center space-x-10 text-xl font-medium lg:flex">
            <Scroll moveTo="services" className="internal-link text-white">
              Услуги
            </Scroll>
            <Scroll moveTo="how-it-works" className="internal-link text-white">
              Как это работает?
            </Scroll>
            <Scroll moveTo="pricing" className="internal-link text-white">
              Тарифы
            </Scroll>
            <Scroll moveTo="faq" className="internal-link text-white">
              FAQ
            </Scroll>
            <a
              href="https://manager.ids-help.by/login"
              className="external-link text-white"
              draggable={false}
            >
              Менеджер
            </a>
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <div>
              <div className="text-xs">
                <span className="mr-1 animate-pulse bg-linear-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                  Онлайн 24/7
                </span>
                <span className="text-gradient">*</span>
              </div>
              <a href="tel:88011008080">
                <div className="flex items-center">
                  <Image src={PhoneIcon} width={20} height={20} alt="Телефон" />
                  <div className="pl-2.5 text-sm text-white">8 (801) 100-80-80</div>
                </div>
              </a>
            </div>
            <Link
              href="/login"
              className="group bg-gradient flex cursor-pointer items-center justify-between rounded-4xl px-8 py-1.5 text-white transition-all duration-500"
            >
              Вход{' '}
              <Image
                src="/icons/profileLogin.svg"
                alt="Profile login"
                width={18}
                height={18}
                className="ml-2 rounded-full bg-white"
              />
            </Link>
          </div>

          <div className="flex items-center pr-4 lg:hidden">
            <Burger isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
