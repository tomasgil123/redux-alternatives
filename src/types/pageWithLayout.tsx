import { NextPage } from 'next'
import MainLayout from 'src/layouts/main'

type PageWithMainLayout = NextPage & { layout: typeof MainLayout }

type PageWithLayout = PageWithMainLayout

export default PageWithLayout
