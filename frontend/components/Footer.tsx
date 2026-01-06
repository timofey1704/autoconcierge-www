import Link from 'next/link'
import Image from 'next/image'
import LogoWhite from '../public/icons/LogoWhite.svg'
import PhoneIcon from '../public/icons/footer/Phone.svg'
import FacebookIcon from '../public/icons/footer/Facebook.svg'
import LinkedInIcon from '../public/icons/footer/LinkedIn.svg'
import InstagramIcon from '../public/icons/footer/Instagram.svg'
import DribbbleIcon from '../public/icons/footer/Dribbble.svg'
import Scroll from '@/app/hooks/useScroll'

const Footer = () => {
  return (
    <footer className="h-216.5 w-full bg-black px-5 pt-10 pb-5 text-white md:h-159 lg:px-28 lg:pt-15 lg:pb-10 xl:h-101.75">
      <div className="flex flex-wrap justify-between gap-10 pb-10 xl:gap-0">
        <div className="w-150.25 lg:w-155">
          <div>
            <div>
              <Link
                href="/"
                className="flex items-baseline gap-2 transition-opacity duration-300 hover:cursor-pointer hover:opacity-80"
              >
                <Image
                  src={LogoWhite}
                  width={145}
                  height={26}
                  alt="СБЛ Лизинг"
                />
              </Link>
            </div>
            <p className="pt-2.5">
              Круглосуточная помощь на дорогах
              <br /> по всей Республике Беларусь
            </p>
          </div>
          <p className="pt-10 lg:pt-9">
            Сервис предоставляет общество с ограниченной ответственностью «ИнДиЭс Бай»,
            зарегистрированное по адресу Республика Беларусь, 220034, г. Минск, Войсковый пер., д,
            12, каб. 4
          </p>
        </div>
        <div className="flex w-full flex-col justify-between xl:w-auto">
          <div className="flex flex-wrap items-center justify-between gap-5 lg:gap-10">
            <div>
              <div className="flex items-center">
                <hr className="gradient-line h-0.5 border-0" />
                <h5 className="lg:pl-3">ТЕЛЕФОН</h5>
              </div>
              <a href="tel:88011008080">
                <div className="flex items-center pt-4">
                  <Image src={PhoneIcon} width={44} height={44} alt="Телефон" />
                  <h4 className="pl-2.5">8 (801) 100-80-80</h4>
                </div>
              </a>
            </div>
            <div>
              <div className="flex items-center">
                <hr className="gradient-line h-0.5 border-0" />
                <h5 className="lg:pl-3">СОЦИАЛЬНЫЕ СЕТИ</h5>
              </div>
              <div className="flex items-center gap-5 pt-4">
                <a
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Image src={FacebookIcon} width={44} height={44} alt="Facebook" />
                </a>
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Image src={LinkedInIcon} width={44} height={44} alt="LinkedIn" />
                </a>
                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Image src={InstagramIcon} width={44} height={44} alt="Instagram" />
                </a>
                <a
                  href="https://Dribbble.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Dribbble"
                >
                  <Image src={DribbbleIcon} width={44} height={44} alt="Dribbble" />
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-wrap justify-start gap-5 pt-10 md:flex-row md:justify-between lg:flex-row lg:justify-between lg:gap-10 xl:justify-end xl:pt-24">
            <Scroll moveTo="services" className="internal-link text-white">
              Пакеты услуг
            </Scroll>
            <Scroll moveTo="how-it-works" className="internal-link text-white">
              Как это работает
            </Scroll>
            {/* Вернуть ссылку, когда появится отдельная страница */}
            {/* <Link href="/partners" className="internal-link">
              Партнеры
            </Link> */}
          </div>
        </div>
      </div>

      <hr className="h-0.5 rotate-180 border-0 bg-(image:--color-gradient)" />

      <div className="flex flex-wrap justify-between gap-2.5 pt-10 lg:pt-5">
        <p>Все права защищены © 2025</p>
        {/* Вернуть ссылку, когда появится отдельная страница */}
        {/* <Link href="/privacy-policy" className="internal-link">
          Политика конфиденциальности
        </Link> */}
      </div>
    </footer>
  )
}

export default Footer
