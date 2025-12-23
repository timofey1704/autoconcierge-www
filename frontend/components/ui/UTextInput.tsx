import { TextInputProps } from '@/app/types'
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'

const UTextInput = ({
  value,
  handleChange,
  label,
  placeholder,
  name,
  type = 'text',
  className = '',
  maxLength,
  min,
  helper_text,
  isPassword,
  togglePasswordVisibility,
  isVisible,
  error,
}: TextInputProps) => {
  return (
    <div className={className}>
      {label && (
        <div className="my-2">
          <label className="text-base font-medium text-black" htmlFor={name}>
            {label}
          </label>
        </div>
      )}
      <div className="relative">
        <input
          type={isPassword ? (isVisible ? 'text' : 'password') : type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value || ''}
          onChange={handleChange}
          className={`w-full border bg-white px-3 py-2 ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-[20px] text-black focus:ring-1 focus:outline-none ${
            error ? 'focus:ring-red-400' : 'focus:ring-blue-400'
          } focus:bg-white`}
          autoComplete={name}
          maxLength={maxLength}
          min={min}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {isVisible ? <HiOutlineEye /> : <HiOutlineEyeOff />}
          </button>
        )}
      </div>
      {helper_text && !error && <div className="mt-1 text-sm text-gray-500">{helper_text}</div>}
      {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
    </div>
  )
}

export default UTextInput
