import React, { FC } from 'react'

//layout
import MainLayout from 'src/layouts/main'

//types
import PageWithLayout from 'src/types/pageWithLayout'

const SecondPage: FC = () => {
  return <div>Second page</div>
}

;(SecondPage as PageWithLayout).layout = MainLayout

export default SecondPage
