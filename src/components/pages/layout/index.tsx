import React from 'react'
import Header from '../header'
import Footer from '../footer'
import SessionProvider from '../../../contexts/session'

interface ILayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  return (
    <SessionProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        {children}
        <Footer />
      </div>
    </SessionProvider>
  )
}

export default Layout
