import { ConfigProvider, theme } from 'antd'
import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Layout } from '@/components/Layout'
import { useAuthStore } from '@/store/auth'
import { useThemeStore } from '@/store/theme'

const { defaultAlgorithm, darkAlgorithm } = theme

function App() {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage)
  const isDark = useThemeStore((s) => s.isDark)
  const mode = useThemeStore((s) => s.mode)

  // 应用启动时恢复登录状态
  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  // 同步 data-theme 属性到 <html>，用于全局 CSS
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
        },
      }}
    >
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
