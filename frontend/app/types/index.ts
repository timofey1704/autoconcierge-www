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
