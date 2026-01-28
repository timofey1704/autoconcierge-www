import { Suspense } from 'react'
import Loader from '@/components/ui/Loader'
import KnowledgeBase from './components/KnowledgeBase'
import VideoResources from './components/VideoResources'

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <div className="space-y-5">
        <KnowledgeBase />
        <VideoResources />
      </div>
    </Suspense>
  )
}

export default page
