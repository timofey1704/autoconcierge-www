'use client'

import { mediaResources } from '@/app/constants/knowledgeBase'
import Image from 'next/image'
import { useState } from 'react'
import { FaPlay } from 'react-icons/fa'

const VideoResources = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const handleVideoClick = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className="my-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mediaResources.map(item => (
        <div
          key={item.id}
          className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          onClick={() => handleVideoClick(item.url)}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />

            <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover:bg-black/40">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-all duration-300 ${
                  hoveredId === item.id ? 'scale-110' : 'scale-100'
                }`}
              >
                <FaPlay className="text-orange ml-1 text-2xl" />
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="bg-orange/10 text-orange rounded-full px-3 py-1 text-xs font-medium">
                {item.type}
              </div>
              <div className="rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                {item.duration}
              </div>
            </div>
            <h3 className="group-hover:text-orange line-clamp-2 text-base! leading-snug font-medium text-gray-800 transition-colors">
              {item.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  )
}

export default VideoResources
