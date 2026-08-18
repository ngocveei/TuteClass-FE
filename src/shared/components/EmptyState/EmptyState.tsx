import { Empty } from 'antd'

interface EmptyStateProps {
  description?: string
}

export function EmptyState({ description = 'Chưa có dữ liệu' }: EmptyStateProps) {
  return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />
}
