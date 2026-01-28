'use client'

import { Suspense } from 'react'
import ActivationForm from './forms/ActivationForm'
import Loader from '@/components/ui/Loader'

const ActivationPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ActivationForm />
    </Suspense>
  )
}

export default ActivationPage
