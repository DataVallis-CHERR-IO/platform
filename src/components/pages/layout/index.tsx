import React from 'react'
import Header from '../header'
import Footer from '../footer'
import { IDefaultProps } from '../../../interfaces/components'

const Layout: React.FC<IDefaultProps> = ({ children }) => {
  return (
    <>
      <Header /> {children} <Footer />
    </>
  )
}

export default Layout
