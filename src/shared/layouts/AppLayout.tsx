import { BookOutlined, LogoutOutlined } from '@ant-design/icons'
import { Button, Layout, Menu, Typography } from 'antd'
import type { ItemType } from 'antd/es/menu/interface'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { getTokens, removeTokens } from '@/services/auth/tokenStorage'
import { apiClient } from '@/services/api/apiClient'
import { WorkspaceLayout } from '@/shared/layouts/AppLayout/WorkspaceLayout'

interface AppLayoutProps {
  menuItems: ItemType[]
  homePath: string
  roleLabel: string
}

export function AppLayout({ menuItems, homePath, roleLabel }: AppLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const logout = async () => {
    const refreshToken = getTokens()?.refreshToken
    if (refreshToken) {
      try {
        await apiClient.post('/api/auth/logout', { refreshToken })
      } catch {
        // Local logout must still work if the API is unavailable.
      }
    }
    removeTokens()
    navigate('/login', { replace: true })
  }

  if (homePath.startsWith('/student')) return <WorkspaceLayout role="student" />
  if (homePath === '/classes') return <WorkspaceLayout role="teacher" />

  return (
    <Layout className="app-shell">
      <Layout.Sider width={240} breakpoint="lg" collapsedWidth={0}>
        <Link to={homePath} className="brand">
          <BookOutlined />
          <span>TuteClass</span>
        </Link>
        <Menu mode="inline" selectedKeys={[location.pathname]} items={menuItems} />
      </Layout.Sider>
      <Layout>
        <Layout.Header className="app-header">
          <Typography.Text type="secondary">{roleLabel}</Typography.Text>
          <Button type="text" icon={<LogoutOutlined />} onClick={logout} title="Đăng xuất" />
        </Layout.Header>
        <Layout.Content className="app-content">
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
