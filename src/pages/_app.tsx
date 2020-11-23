import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

//styles
import 'src/styles/globals.css'

//types
import PageWithLayoutType from 'src/types/pageWithLayout'

const queryCache = new QueryClient()

type AppLayoutProps = {
  Component: PageWithLayoutType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageProps: any
}

function MyApp({ Component, pageProps }: AppLayoutProps): JSX.Element {
  const Layout = Component.layout ? Component.layout : React.Fragment

  return (
    <QueryClientProvider client={queryCache}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  )
}

export default MyApp
