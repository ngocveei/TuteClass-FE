import { Flex, Spin } from 'antd'

export function Loading() {
  return (
    <Flex align="center" justify="center" className="page-state">
      <Spin size="large" tip="Đang tải..." />
    </Flex>
  )
}
