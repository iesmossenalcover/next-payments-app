import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'

const font = Inter({ subsets: ['latin'], display: 'swap' })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Variable global perquè també arribi als portals (createPortal a document.body). */}
      <style jsx global>{`
        :root {
          --font-sans: ${font.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}
