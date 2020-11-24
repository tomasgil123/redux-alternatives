import React, { useEffect } from 'react'
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

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(
          function (registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope)
          },
          function (err) {
            console.log('Service Worker registration failed: ', err)
          }
        )
      })
    }
  }, [])

  return (
    <QueryClientProvider client={queryCache}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  )
}

export default MyApp
