import '@mantine/core/styles.css'

import type { AppProps } from 'next/app'
import { MantineProvider, createTheme } from '@mantine/core'
import { Provider as RTKProvider } from 'react-redux'
import { store } from '../store'
import Header from '@/components/Header'

import '../globals.css'

const theme = createTheme({
  
})

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <RTKProvider store={store}>
        <main className="flex flex-col min-h-screen">
          <Header/>

          <div className="grow flex flex-col items-center justify-between p-4">
            <div className="max-w-4xl w-full">
              <Component {...pageProps} />
            </div>
          </div>
        </main>
      </RTKProvider>
    </MantineProvider>
  )
}