import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { PublicHeader } from '@/shared/layouts/AuthLayout/PublicHeader'

export function AuthLayout() {
  return (
    <Layout className="auth-layout">
      <PublicHeader />
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}
