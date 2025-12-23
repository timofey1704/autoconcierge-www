import Link from 'next/link'
import Burger from './Burger'
import Scroll from '@/app/hooks/useScroll'

const Header = () => {
  return (
    <div className="bg-gray flex items-center justify-between p-4">
      <div className="pl-4 sm:pl-8 lg:pl-23">
        <Link
          href="/"
          className="flex gap-2 transition-opacity duration-300 hover:cursor-pointer hover:opacity-80"
        >
          <h4>СБЛ</h4>
          <span className="mt-auto mb-0.5 text-lg">Лизинг</span>
        </Link>
      </div>
      <div className="ml-10 hidden items-center justify-center space-x-10 text-xl font-medium lg:flex">
        <Scroll moveTo="services" className="internal-link">
          Услуги
        </Scroll>

        <Scroll moveTo="how-it-works" className="internal-link">
          Как это работает?
        </Scroll>

        <Scroll moveTo="pricing" className="internal-link">
          Тарифы
        </Scroll>

        <Scroll moveTo="faq" className="internal-link">
          FAQ
        </Scroll>
      </div>

      <div className="flex items-center space-x-4 pr-4 sm:pr-8 lg:hidden">
        <Burger />
      </div>
    </div>
  )
}

export default Header
