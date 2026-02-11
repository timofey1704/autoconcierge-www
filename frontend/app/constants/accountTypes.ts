export const accountTypeToDisplayName = {
  free: 'Без подписки',
  light: 'Light',
  medium: 'Medium',
  premium: 'Premium',
} as const

// для бекенда
export const displayNameToAccountType: Record<string, keyof typeof accountTypeToDisplayName> = {
  free: 'free',
  Light: 'light',
  Medium: 'medium',
  Premium: 'premium',
}

export const getAccountTypeStyles = (accountType: string) => {
  switch (accountType.toLowerCase()) {
    case 'free':
      return 'bg-gray-100 text-gray-700 border border-gray-300'
    case 'light':
      return 'bg-blue-100 text-blue-700 border border-blue-200'
    case 'medium':
      return 'bg-gradient-to-r from-blue-400 to-blue-500 text-white'
    case 'premium':
      return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
    default:
      return 'bg-gray-200 text-gray-700'
  }
}
