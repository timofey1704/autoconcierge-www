import Link from 'next/link'
import Image from 'next/image'
import IDSLogoWhite from '../public/icons/IDSLogoWhite.svg'
import SBLLogoWhite from '../public/icons/SBLLogoWhite.svg'
import PhoneIcon from '../public/icons/footer/Phone.svg'
import FacebookIcon from '../public/icons/footer/Facebook.svg'
import LinkedInIcon from '../public/icons/footer/LinkedIn.svg'
import InstagramIcon from '../public/icons/footer/Instagram.svg'
import DribbbleIcon from '../public/icons/footer/Dribbble.svg'
import Scroll from '@/app/hooks/useScroll'

const Footer = () => {
  return (
    <footer className="w-full bg-black px-5 pt-10 pb-5 text-white lg:px-28 lg:pt-15 lg:pb-10">
      <div className="flex flex-wrap justify-between gap-10 xl:gap-0">
        <div className="w-150.25 lg:w-155">
          <div>
            <div className="w-26.5">
              <Link
                href="/"
                className="flex items-baseline gap-2 transition-opacity duration-300 hover:cursor-pointer hover:opacity-80"
                draggable={false}
              >
                <Image
                  src={IDSLogoWhite}
                  width={106}
                  height={40}
                  alt="IDS"
                  draggable={false}
                  quality={100}
                  unoptimized={true}
                />
              </Link>
            </div>
            <p className="pt-2.5">
              Круглосуточная помощь на дорогах
              <br /> по всей Республике Беларусь
            </p>
          </div>
          <p className="text-dark-gray pt-10 lg:pt-9">
            Сервис предоставляет общество с ограниченной ответственностью «ИнДиЭс Бай»,
            зарегистрированное по адресу Республика Беларусь, 220034, г. Минск, Войсковый пер., д.
            12, каб. 4
          </p>

          <div className="flex flex-col gap-5 pt-10 xl:pb-10">
            <p>Партнер сервиса</p>
            <Image src={SBLLogoWhite} width={150} height={26} alt="СБЛ Лизинг" draggable={false} />
          </div>
        </div>
        <div className="flex w-full flex-col pb-10 xl:w-auto xl:pb-0">
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
          <div className="flex flex-col flex-wrap justify-start gap-5 pt-10 md:flex-row md:justify-between lg:flex-row lg:justify-between lg:gap-10 xl:justify-end xl:pt-26.5">
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

      {/* <div className="flex flex-col gap-5 py-10">
        <p>Партнер сервиса</p>
        <Image src={SBLLogoWhite} width={150} height={26} alt="СБЛ Лизинг" draggable={false} />
      </div> */}

      <hr className="h-0.5 rotate-180 border-0 bg-(image:--color-gradient)" />

      <div className="flex flex-wrap justify-between gap-2.5 pt-10 lg:pt-5">
        <p>Все права защищены © {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}

export default Footer
