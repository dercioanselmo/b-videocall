import { AgoraClientProvider } from '@/providers/AgoraClientProvider'
import React,{ ReactNode } from 'react'

const RootLayout = ({children} : {children : ReactNode}) => {
  return (
    <main>
      <AgoraClientProvider>
        {children}
      </AgoraClientProvider>
    </main>
  )
}

export default RootLayout