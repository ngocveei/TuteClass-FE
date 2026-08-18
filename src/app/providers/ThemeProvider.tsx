import { App as AntdApp, ConfigProvider } from 'antd'
import type { PropsWithChildren } from 'react'
import { themeConfig } from '@/config/theme.config'

export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <ConfigProvider theme={themeConfig}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  )
}
