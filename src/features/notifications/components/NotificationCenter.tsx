import { InfoCircleOutlined, SettingOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Drawer, Form, Select, Space, Switch } from 'antd'
import { useState } from 'react'

export function NotificationCenter() {
  const [preferencesOpen, setPreferencesOpen] = useState(false)

  return (
    <>
      <Card className="notification-center teacher-notifications__center">
        <div className="notification-center__toolbar teacher-notifications__toolbar">
          <Space wrap>
            <Select
              disabled
              aria-label="Lọc theo loại thông báo"
              placeholder="Tất cả loại"
              className="teacher-notifications__filter"
            />
            <Select
              disabled
              aria-label="Lọc theo trạng thái đọc"
              value="all"
              options={[{ value: 'all', label: 'Tất cả trạng thái' }]}
              className="teacher-notifications__filter"
            />
          </Space>
          <Space wrap>
            <Button disabled>Đánh dấu tất cả đã đọc</Button>
            <Button icon={<SettingOutlined />} onClick={() => setPreferencesOpen(true)}>
              Tùy chọn
            </Button>
          </Space>
        </div>
        <Alert
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          title="Backend chưa hỗ trợ thông báo"
          description="Thông báo sẽ xuất hiện tại đây khi Backend công bố contract chính thức."
        />
        <div className="notification-empty notification-center__empty">
          Không có thông báo phù hợp.
        </div>
      </Card>

      <Drawer
        title="Tùy chọn thông báo"
        open={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
        destroyOnHidden
      >
        <Alert
          type="info"
          showIcon
          message="Backend chưa hỗ trợ lưu tùy chọn thông báo."
          className="notification-preferences__alert"
        />
        <Form layout="vertical" disabled>
          <Form.Item label="Thông báo trong ứng dụng"><Switch checked /></Form.Item>
          <Form.Item label="Thông báo qua email"><Switch /></Form.Item>
          <Form.Item label="Tần suất tổng hợp">
            <Select value="instant" options={[{ value: 'instant', label: 'Ngay lập tức' }]} />
          </Form.Item>
          <Button type="primary" disabled>Lưu tùy chọn</Button>
        </Form>
      </Drawer>
    </>
  )
}
