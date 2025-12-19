export interface ValidationRules {
  required?: boolean
  minLength?: number
  pattern?: RegExp
}

export interface ValidationErrors {
  [key: string]: string
}

export interface User {
  id?: number | undefined | string
  uuid?: string
  phone_number: string
  vin_code: string
  qr_code: string
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
  is_popular: boolean
  features: MembershipFeature[]
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
}
