'use client'

import { motion } from 'framer-motion'

function AppSection() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center bg-gray-100 px-12 lg:px-72">

      {/* Left Side: Text and Buttons */}
      <motion.div
        className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
          Get the learning app
        </h2>
        <p className="text-gray-400 text-lg mb-6">
          Download lessons and learn anytime with effectivily from ourself, anywhere with the advanced computer classes app.
        </p>
        {/* Download Buttons */}
        <div className="flex justify-center lg:justify-start space-x-4">
          <a href="https://play.google.com/store/apps/details?id=co.jorah.axsuf&pcampaignid=web_share" target="_blank" rel="noopener noreferrer">
            <img
              src="/img/appsection.jpg"
              alt="Get it on Google Play"
              className="h-12"
            />
          </a>
          <div>
            <a href="https://apps.apple.com/us/app/classplus/id1324522260" target="_blank" rel="noopener noreferrer">
              <img
                src="/img/appstore.jpg"
                alt="Get it on App Store"
                className="h-12"
              />
            </a>
            <p className="bg-yellow-400 text-black text-xs px-2 py-1 rounded mt-2 inline-block">App Store ORG:AXSUF</p>
          </div>
        </div>
      </motion.div>

      {/* Right Side: Mobile Screens */}
      <motion.div
        className="mt-10 mb-[-10px] lg:w-1/2 flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <img
          src="/img/appsectionstore.png"
          alt="Mobile App Preview"
          className="max-w-xs md:max-w-md h-130"
        />
      </motion.div>

    </div>
  )
}

export default AppSection
