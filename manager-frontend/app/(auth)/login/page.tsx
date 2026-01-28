'use client'

import { Suspense } from 'react'
import Loader from '@/components/ui/Loader'
import LoginForm from './forms/LoginForm'

const LoginPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <LoginForm />
    </Suspense>
  )
}

export default LoginPage
