export const formatDate = (dateString: string | null | undefined): string | null => {
  if (!dateString) return null

  try {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  } catch (error) {
    return null
  }
}

export const formatDateTime = (dateString: string | null | undefined): string | null => {
  if (!dateString) return null

  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 24-часовой формат
    }).format(date)
  } catch (error) {
    return null
  }
}
