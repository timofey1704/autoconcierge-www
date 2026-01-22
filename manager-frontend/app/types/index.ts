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
