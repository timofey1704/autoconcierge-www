import { ReactNode } from 'react'
export interface User {
  id?: number | undefined | string
  uuid?: string
  name: string
  surname: string
  image?: string
  account_type: string
  partner_company: string
}

export interface UserState {
  isAuthenticated: boolean
  user: User | null
}

export interface NavigationItem {
  name: string
  href: string
  icon: string
}

export interface AccountSidebarProps {
  user: User
  navigation: NavigationItem[]
}

export type ToastProps = {
  type: 'error' | 'success' | 'loading'
  message: string
  action?: {
    text: string
    onClick: () => void
  }
  duration?: number
}

export interface ButtonProps {
  onClick?: () => void
  className?: string
  text?: string
  leftIcon?: React.ReactNode
  midIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'text'
  loading?: boolean
}

export interface ValidationRules {
  required?: boolean
  minLength?: number
  pattern?: RegExp
}

export interface ValidationErrors {
  [key: string]: string
}

export interface TextInputProps {
  value: string
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  icon?: React.ReactNode
  placeholder?: string
  name: string
  type?: 'text' | 'email' | 'password' | 'datetime-local' | 'date'
  className?: string
  maxLength?: number
  tooltip?: string | React.ReactNode
  helper_text?: string
  isPassword?: boolean
  isVisible?: boolean
  togglePasswordVisibility?: () => void
  error?: string
  min?: string
  max?: string
  labelClassName?: string
}

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description: ReactNode
  submitText?: string
  onSubmit?: () => void
  showCancel?: boolean
  showSubmit?: boolean
  cancelText?: string
}

export type SelectOption<T> = {
  value: T
  label: string
}

export type MultiSelectProps<T> = {
  value: T[]
  handleChange: (value: T[]) => void
  label?: string
  placeholder?: string
  name: string
  options: SelectOption<T>[]
  className?: string
  noOptionsMessage?: string
}
