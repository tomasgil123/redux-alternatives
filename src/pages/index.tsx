/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'

//layout
import MainLayout from 'src/layouts/main'

//components
import Link from 'next/link'
import List from 'src/components/list'

//types
import PageWithLayout from 'src/types/pageWithLayout'

const Home: FC = () => {
  return (
    <div>
      Home
      <button>
        <Link href="/second-page">
          <a>Go to second page</a>
        </Link>
      </button>
      <List />
    </div>
  )
}

;(Home as PageWithLayout).layout = MainLayout

export default Home
