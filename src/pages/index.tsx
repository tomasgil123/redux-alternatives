import React, { FC } from 'react'

import MainLayout from 'src/layouts/main'

//types
import PageWithLayout from 'src/types/pageWithLayout'

const Home: FC = () => {
  return <div>Home</div>
}

;(Home as PageWithLayout).layout = MainLayout

export default Home
