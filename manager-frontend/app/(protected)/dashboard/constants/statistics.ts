// Типы данных для таблицы статистики (соответствуют бэкенду)

export type DataRow = {
  id: number
  qr_code: string
  client_full_name: string
  membership_type: 'Light' | 'Medium' | 'Premium'
  client_phone_number: string | null
  is_active: boolean
  last_activity: string | null
  company: string | null
  department: string | null
}

export type DashboardResponse = {
  data: DataRow[]
  count: number
  page: number
  page_size: number
  total_pages: number
  filters: {
    membership_type: string | null
    is_active: string | null
    search: string | null
    sort_by: string
    sort_order: string
  }
}
