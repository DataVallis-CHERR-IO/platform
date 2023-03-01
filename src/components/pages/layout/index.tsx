import React from 'react'
import Header from '../header'
import Footer from '../footer'

interface ILayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
