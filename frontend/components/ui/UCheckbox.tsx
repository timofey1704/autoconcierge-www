import React, { InputHTMLAttributes, forwardRef, ReactNode } from 'react'

interface UCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  children?: ReactNode
}

const UCheckbox = forwardRef<HTMLInputElement, UCheckboxProps>(
  ({ label, children, className = '', ...props }, ref) => {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <label className="relative cursor-pointer">
          <input ref={ref} type="checkbox" className="peer sr-only" {...props} />

          <div className="flex h-5 w-5 items-center justify-center rounded border border-gray-300 bg-white transition-all duration-300 ease-in-out peer-checked:border-transparent peer-checked:bg-linear-to-br peer-checked:from-[#107f8c] peer-checked:to-[#6abaa2] peer-hover:border-[#107f8c] peer-focus:ring-2 peer-focus:ring-[#107f8c]/20 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
            <svg
              className="h-4 w-4 scale-0 text-white transition-all duration-300 ease-in-out peer-checked:scale-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </label>

        {children ? (
          <div className="text-sm text-gray-700 select-none">{children}</div>
        ) : label ? (
          <span className="text-sm text-gray-700 select-none">{label}</span>
        ) : null}
      </div>
    )
  }
)

UCheckbox.displayName = 'UCheckbox'

export default UCheckbox
