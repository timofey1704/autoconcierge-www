import { ReactNode } from 'react'

export interface ValidationRules {
  required?: boolean
  minLength?: number
  pattern?: RegExp
}

export interface ValidationErrors {
  [key: string]: string
}

export interface CityData {
  id: number
  name: string
  country: string
  display_name: string
}

export interface User {
  id?: number | undefined | string
  uuid?: string
  firstName: string
  surname?: string
  patronymic?: string
  account_type: string
  phone_number: string
  image?: string
  email?: string
  city?: CityData | string | null
  address?: string
  telegram_id?: string
}

export interface UserState {
  isAuthenticated: boolean
  user: User | null
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

export interface FAQ {
  id: number
  title: string
  content: string | React.ReactNode
}

export interface FAQProps {
  faqs: FAQ[]
  id: string
}

export interface AccordionProps {
  title: string
  content: string | React.ReactNode
}

interface MembershipFeature {
  id: number
  name: string
}

export interface Membership {
  id: number
  plan: string
  price?: number
  description: string
  is_recommended: boolean
  features: MembershipFeature[]
  actual_before?: string | null // Дата окончания подписки (ISO 8601)
}

export interface PricingCardProps {
  memberships: Membership[]
}

export interface ButtonProps {
  onClick?: () => void
  className?: string
  text?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
}

export interface TextInputProps {
  value: string
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
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

export interface CardSliderProps {
  memberships: Membership[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sliderRef?: React.RefObject<any>
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

export interface LocationOption {
  value: string
  label: string
  id: number
}

export interface CityResponse {
  id: number
  name: string
  country: string
  display_name: string
}

export interface LocationSelectProps {
  name: string
  value: CityData | null
  handleChange: (e: {
    target: { id: string; value: CityData | null; selectedOption?: LocationOption }
  }) => void
  label: string
  placeholder: string
  tooltip?: string | React.ReactNode
  isRequired?: boolean
}

export interface Car {
  id: number
  vin_code: string
  image?: string
  qr_image: string
  qr_code: string
  brand: string
  model: string
  body_type: string
  year_built: number
  color: string
  lising_company: string
  licence_plate: string
}
