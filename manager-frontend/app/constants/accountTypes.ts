export const accountTypeToDisplayName = {
  supervisor: 'Руководитель',
  manager: 'Менеджер',
} as const

// для бекенда
export const displayNameToAccountType: Record<string, keyof typeof accountTypeToDisplayName> = {
  'Начальник отдела ЦУ': 'supervisor',
  'Специалист ЦУ': 'manager',
}

export const getAccountTypeStyles = (accountType: string) => {
  switch (accountType.toLowerCase()) {
    case 'supervisor':
      return 'bg-orange/70 text-white'
    case 'manager':
      return 'bg-blue-500 text-white'
    default:
      return 'bg-gray-200'
  }
}

//fix - 09.02.2025
// 1. Руководитель,
// 2. Менеджер
