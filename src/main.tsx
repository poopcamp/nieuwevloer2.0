
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ChunkErrorBoundary from './components/ChunkErrorBoundary'
import { installChunkReloadGuard } from './utils/chunkLoadError.mjs'
import { captureStaticHead, installStaticHeadLock } from './seo/staticHead.mjs'
import { installInternalLinkRewriter } from './seo/installLinks.mjs'
import { Toaster } from "@/components/ui/sonner"
import { Toaster as AppToaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const staticHead = captureStaticHead()
installStaticHeadLock(staticHead)
installChunkReloadGuard()
installInternalLinkRewriter()

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChunkErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster />
        <AppToaster />
      </QueryClientProvider>
    </ChunkErrorBoundary>
  </React.StrictMode>,
)
