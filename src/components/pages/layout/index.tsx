import { IDefaultProps } from '../../../interfaces/components'
import Header from '../header'
import Footer from '../footer'
import React from 'react'

const Layout: React.FC<IDefaultProps> = ({ children }) => {
  return (
    <>
      <Header /> {children} <Footer />
    </>
  )
}

export default Layout
