import { BookOutlined, TeamOutlined } from '@ant-design/icons'
import { Card, Flex, Tag, Typography } from 'antd'
import { Link } from 'react-router-dom'
import type { Class } from '@/features/classes/types/class.types'
import { getClassStatusText } from '@/features/classes/utils/class.utils'
import { ROUTES } from '@/shared/constants/routes'

interface ClassCardProps {
  classItem: Class
}

export function ClassCard({ classItem }: ClassCardProps) {
  return (
    <Card size="small">
      <Flex vertical gap={12}>
        <Flex justify="space-between" gap={8}>
          <Link to={ROUTES.teacherClassDetail(classItem.id)}>
            <Typography.Text strong>{classItem.name}</Typography.Text>
          </Link>
          <Tag color={classItem.status === 'Active' ? 'green' : 'default'}>
            {getClassStatusText(classItem.status)}
          </Tag>
        </Flex>
        <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>
          {classItem.description || 'Không có mô tả'}
        </Typography.Paragraph>
        <Typography.Text type="secondary">
          <TeamOutlined /> {classItem.studentCount} học viên
        </Typography.Text>
        <BookOutlined />
      </Flex>
    </Card>
  )
}
