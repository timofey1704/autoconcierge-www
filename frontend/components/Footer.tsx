import Link from 'next/link'
import Image from 'next/image'
import PhoneIcon from '../public/icons/footer/Phone.svg'
import FacebookIcon from '../public/icons/footer/Facebook.svg'
import LinkedInIcon from '../public/icons/footer/LinkedIn.svg'
import InstagramIcon from '../public/icons/footer/Instagram.svg'
import DribbbleIcon from '../public/icons/footer/Dribbble.svg'
import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full h-[866px] lg:h-[407px] bg-black text-white pt-10 px-5 pb-5 lg:pt-15 lg:px-28 lg:pb-10">
      <div className="flex justify-between flex-wrap gap-10 pb-10">
        <div className="w-[601px]"> 
          <div>
            <div className="flex items-end gap-2">
              <h4>СБЛ</h4>
              <span className="text-[16px] leading-[24px] lg:text-[22px] lg:leading-[30px] font-normal">Лизинг</span>
            </div>
            <p className="pt-[10px]">Круглосуточная помощь на дорогах<br/> по всей Республике Беларусь</p>
          </div>
          <p className="pt-10 lg:pt-9">Сервис предоставляет общество с ограниченной ответственностью
            «ИнДиЭс Бай», зарегистрированное по адресу Республика
            Беларусь, 220034, г. Минск, Войсковый пер., д, 12, каб. 4</p>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex items-center justify-between flex-wrap gap-5 lg:gap-10">
            <div>
              <div className="flex items-center">
                <hr className="w-[32px] h-[2px] border-0 gradient-line" />
                <h5 className="lg:pl-3">ТЕЛЕФОН</h5>
              </div>
              <div className="flex items-center pt-4">
                <Image
                  src={PhoneIcon}
                  width={44}
                  height={44}
                  alt="Телефон"
                />
                <h4 className="pl-[10px]">8 (801) 100-80-80</h4>
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <hr className="w-[32px] h-[2px] border-0 gradient-line" />
                <h5 className="lg:pl-3">СОЦИАЛЬНЫЕ СЕТИ</h5>
              </div>
              <div className="flex items-center gap-5 pt-4">
                <a 
                  href="https://facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  >
                    <Image 
                      src={FacebookIcon}
                      width={44}
                      height={44}
                      alt="Facebook"
                    />
                </a>
                <a 
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  >
                    <Image 
                      src={LinkedInIcon}
                      width={44}
                      height={44}
                      alt="LinkedIn"
                    />
                </a>
                <a 
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  >
                    <Image 
                      src={InstagramIcon}
                      width={44}
                      height={44}
                      alt="Instagram"
                    />
                </a>
                <a 
                  href="https://Dribbble.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Dribbble"
                  >
                    <Image 
                      src={DribbbleIcon}
                      width={44}
                      height={44}
                      alt="Dribbble"
                    />
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-start lg:justify-end flex-wrap gap-5 lg:gap-10 pt-10 lg:pt-24">
            <Link href="/service-packages">Пакеты услуг</Link>
            <Link href="/how-it-works">Как это работает</Link>
            <Link href="/partners">Партнеры</Link>
          </div>
        </div>
      </div>

      <hr className="h-[2px] border-0 bg-(image:--color-gradient) rotate-180" />

      <div className="pt-10 lg:pt-5 flex justify-between flex-wrap gap-[10px]">
        <p>Все права защищены © 2025</p>
        <p>Политика конфиденциальности</p>
      </div>
    </footer>
  )
}

export default Footer
