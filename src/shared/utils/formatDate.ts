import dayjs from 'dayjs'

export function formatDate(value: string | Date, format = 'DD/MM/YYYY'): string {
  return dayjs(value).format(format)
}
