import React from 'react'
import { useGetTodos } from 'src/hooks'

type LayoutProps = {
  children: React.ReactNode
}

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  const { isLoading, error, data } = useGetTodos()

  if (isLoading) return <div>Loading layout...</div>

  if (error) return <div>{`An error has occurred: ${error.message}`}</div>

  return (
    <>
      <div>
        <span>Layout</span>
        <div>{`Elements in the layout: ${data?.length} `}</div>
        {children}
      </div>
    </>
  )
}

export default Layout
