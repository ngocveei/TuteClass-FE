import { EyeOutlined } from '@ant-design/icons'
import { Button, Table, Tag, Tooltip, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'
import type { Class } from '@/features/classes/types/class.types'
import { getClassStatusText } from '@/features/classes/utils/class.utils'
import { ROUTES } from '@/shared/constants/routes'

interface ClassTableProps {
  classes: Class[]
  loading?: boolean
}

export function ClassTable({ classes, loading }: ClassTableProps) {
  const navigate = useNavigate()

  const columns: ColumnsType<Class> = [
    {
      title: 'Tên lớp',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Typography.Text strong>{name}</Typography.Text>,
    },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: 'Học viên', dataIndex: 'studentCount', key: 'studentCount', width: 110 },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: Class['status']) => (
        <Tag color={status === 'Active' ? 'green' : 'default'}>{getClassStatusText(status)}</Tag>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 64,
      render: (_, classItem) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(ROUTES.teacherClassDetail(classItem.id))}
          />
        </Tooltip>
      ),
    },
  ]

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={classes}
      loading={loading}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      scroll={{ x: 720 }}
    />
  )
}
