import { ColumnDef } from '@tanstack/react-table'
import { DataRow } from '../constants/statistics'

export const columns: ColumnDef<DataRow>[] = [
  {
    accessorKey: 'qr_code',
    header: 'QR код',
  },
  {
    accessorKey: 'client_full_name',
    header: 'ФИО клиента',
    cell: ({ getValue }) => <span className="min-w-30">{getValue<string>()}</span>
  },
  {
    accessorKey: 'membership_type',
    header: 'Пакет услуг',
    cell: ({ getValue }) => <span className="text-blue">{getValue<string>()}</span>,
  },
  {
    accessorKey: 'client_phone_number',
    header: 'Телефон',
    cell: ({ getValue }) => {
      const phone = getValue<string | null>()
      return phone || '-'
    },
  },
  {
    accessorKey: 'is_active',
    header: 'Состояние',
    cell: ({ getValue }) => (
      <span
        className={`rounded-[90px] border px-2 py-0.5 ${
          getValue<boolean>()
            ? 'bg-success-secondary border-success-border text-success-main'
            : 'bg-danger-secondary border-danger-border text-danger-main'
        }`}
      >
        {getValue<boolean>() ? 'Активирован' : 'Не активирован'}
      </span>
    ),
  },
  {
    accessorKey: 'last_activity',
    header: 'Последняя активность',
    cell: ({ getValue }) => {
      const date = getValue<string | null>()
      if (!date) return '-'

      // !не забудь про форматтер для даты
      return new Date(date).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })
    },
  },
  {
    accessorKey: 'company',
    header: 'Компания',
    cell: ({ getValue }) => {
      const company = getValue<string | null>()
      return company || '-'
    },
  },
  {
    accessorKey: 'department',
    header: 'Отделение',
    cell: ({ getValue }) => {
      const department = getValue<string | null>()
      return department || '-'
    },
  },
]
