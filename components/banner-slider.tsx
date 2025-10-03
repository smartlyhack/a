'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Play, Pause } from 'lucide-react'

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [showBanner, setShowBanner] = useState(true)

  const banners = [
    { id: 1, src: 'https://images.allchainbridge.com/dex/XVG_banner_en1.png', alt: 'XVG Banner' },
    { id: 2, src: 'https://images.allchainbridge.com/dex/WFTT_banner_en.png', alt: 'WFTT Banner' },
    { id: 3, src: 'https://images.allchainbridge.com/dex/Tronify-banner-en.png', alt: 'Tronify Banner' },
  ]

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || isPaused) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [isAutoPlay, isPaused, banners.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsPaused(true) // Pause auto-play when manually navigating
    setTimeout(() => setIsPaused(false), 5000) // Resume after 5 seconds
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 5000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 5000)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay)
    setIsPaused(false)
  }

  return (
    showBanner && (
      <div className="max-w-2xl mx-auto mb-6">
        <div 
          className="relative overflow-hidden group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Banner Images */}
          <div className="relative h-24 md:h-28 overflow-hidden -mt-2">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                  index === currentSlide ? 'translate-x-0' : 
                  index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                }`}
              >
                <Image
                  src={banner.src || "/placeholder.svg"}
                  alt={banner.alt}
                  fill
                  className="object-contain"
                  priority={index === 0}
                />
              </div>
            ))}
            {/* Close Button */}
            <button
              onClick={() => setShowBanner(false)}
              className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white p-1 rounded-full opacity-70 hover:opacity-100 transition-opacity z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-blue-500 scale-110' 
                    : 'bg-gray-400 hover:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    )
  )
}
