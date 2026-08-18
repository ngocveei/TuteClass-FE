import { Badge, Button, Popover } from 'antd'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import '@/features/notifications/notifications.css'

export function NotificationBell({ triggerIcon }: { triggerIcon?: ReactNode }) {
  const content = (
    <div className="notification-popover">
      <div className="notification-popover__header">
        <strong>Thông báo gần đây</strong>
        <Link to={ROUTES.teacherNotifications}>Xem tất cả</Link>
      </div>
      <div className="notification-empty">
        <span>Chưa có dữ liệu</span>
        <small>Backend chưa hỗ trợ thông báo.</small>
      </div>
    </div>
  )

  return (
    <Popover content={content} trigger="click" placement="bottomRight">
      <Button type="text" className="notification-bell" aria-label="Mở thông báo">
        <Badge count={0} size="small">
          {triggerIcon}
        </Badge>
      </Button>
    </Popover>
  )
}
