import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ConfigProvider } from 'antd'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          fontSize: 16,
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>
)
