'use client'

import { motion } from 'framer-motion'

const StudentReview = () => {
  const imageList = [
    "/img/studentreview/1.png",
    "/img/studentreview/2.png",
    "/img/studentreview/3.png",
    "/img/studentreview/4.png",
    "/img/studentreview/5.png"
  ]

  return (
    <div className="container-fluid">
      <div className="bg-gradient-to-r from-cyan-200 via-blue-gray-700 to-gray-900 flex flex-col items-center p-6">
        <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-4 text-center uppercase pb-6 tracking-wide">
          What Our Students Say
        </h1>

        <div className="flex flex-col md:flex-row gap-8 mb-6 flex-wrap justify-center">
          {imageList.map((src, index) => (
            <motion.img
              key={index}
              src={src}
              alt={`Student Review ${index + 1}`}
              className="w-60 shadow-md rounded-4xl"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default StudentReview
