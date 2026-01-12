'use client'

import { useState, useEffect } from "react"
import axios from "axios"

export default function Slider() {
  const [images, setImages] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("/api/viewallimage")
        setImages(response.data.data)
      } catch (error) {
        console.error("Error fetching images:", error)
      }
    }
    fetchImages()
  }, [])

  const nextSlide = () => {
    if (images.length === 0) return
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    if (images.length === 0) return
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  // Auto-slide
  useEffect(() => {
    if (!isHovered && images.length > 0) {
      const interval = setInterval(nextSlide, 3000)
      return () => clearInterval(interval)
    }
  }, [currentIndex, isHovered, images])

  if (images.length === 0) {
    return <div className="text-center p-4">Loading...</div>
  }

  return (
    <div
      className="relative w-full mx-auto overflow-hidden shadow-lg bg-gray-900"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Wrapper */}
      <div className="relative w-full flex justify-center bg-gray-300">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.image.url || "/placeholder.svg"}
            alt={`Slide ${index + 1}`}
            className={`absolute w-full h-auto max-h-[550px] object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 relative" : "opacity-0 absolute"
            }`}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 text-white text-3xl font-bold drop-shadow-lg hover:scale-110 transition duration-300"
      >
        &#10094;
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 text-white text-3xl font-bold drop-shadow-lg hover:scale-110 transition duration-300"
      >
        &#10095;
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-blue-500 scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
