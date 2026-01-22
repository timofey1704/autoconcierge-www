export const accountTypeToDisplayName = {
  light: 'Light',
  medium: 'Medium',
  premium: 'Premium',
} as const

// для бекенда
export const displayNameToAccountType: Record<string, keyof typeof accountTypeToDisplayName> = {
  Light: 'light',
  Medium: 'medium',
  Premium: 'premium',
}

export const getAccountTypeStyles = (accountType: string) => {
  switch (accountType.toLowerCase()) {
    case 'light':
      return 'bg-gray-300 text-black'
    case 'medium':
      return 'bg-gradient text-white'
    case 'premium':
      return 'bg-blue-500 text-white'
    default:
      return 'bg-gray-200'
  }
}
