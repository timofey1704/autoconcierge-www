export const accountTypeToDisplayName = {
  headOfficeManager: 'Руководитель ГО',
  headServiceCenterDepartment: 'Начальник отдела ЦУ',
  specialist: 'Специалист ЦУ',
} as const

// для бекенда
export const displayNameToAccountType: Record<string, keyof typeof accountTypeToDisplayName> = {
  'Руководитель ГО': 'headOfficeManager',
  'Начальник отдела ЦУ': 'headServiceCenterDepartment',
  'Специалист ЦУ': 'specialist',
}

export const getAccountTypeStyles = (accountType: string) => {
  switch (accountType.toLowerCase()) {
    case 'headOfficeManager':
      return 'bg-gray-400 text-white'
    case 'headServiceCenterDepartment':
      return 'bg-orange/70 text-white'
    case 'specialist':
      return 'bg-blue-500 text-white'
    default:
      return 'bg-gray-200'
  }
}

// 1. Руководитель ГО,
// 2. Начальник отдела ЦУ
// 3. Специалист ЦУ
