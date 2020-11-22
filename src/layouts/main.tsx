import React from 'react'

type LayoutProps = {
  children: React.ReactNode
}

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <>
      <div>
        <span>Layout</span>
        {children}
      </div>
    </>
  )
}

export default Layout
