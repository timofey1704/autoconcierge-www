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
