import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from '@/app/router'
import { Loading } from '@/shared/components/Loading/Loading'

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <AppRouter />
      </Suspense>
    </BrowserRouter>
  )
}
