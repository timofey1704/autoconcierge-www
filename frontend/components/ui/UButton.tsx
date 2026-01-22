import { ButtonProps } from '@/app/types'
import buttonStatic from '../../public/icons/buttonStatic.svg'
import buttonHover from '../../public/icons/buttonHover.svg'
import Image from 'next/image'

const UButton = ({
  onClick,
  className,
  text,
  type,
  leftIcon,
  loading = false,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`group bg-gradient flex cursor-pointer items-center justify-between rounded-[20px] px-2 py-3 transition-all duration-500 ${disabled || loading ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
      type={type}
      disabled={disabled || loading}
    >
      {leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
      <span className="pl-3 text-left text-base font-normal text-white">{text}</span>
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white transition-transform duration-600 ease-in-out">
        <Image
          src={buttonStatic}
          alt="Button icon"
          width={16}
          height={16}
          className="absolute transition-opacity duration-600 ease-in-out group-hover:opacity-0"
        />
        <Image
          src={buttonHover}
          alt="Button icon hover"
          width={16}
          height={16}
          className="absolute opacity-0 transition-opacity duration-600 ease-in-out group-hover:opacity-100"
        />
      </div>
    </button>
  )
}

export default UButton
