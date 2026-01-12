"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function LatestCourse() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(4);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/getNumberCourse");
        setCourses(response.data.recentCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const updateCardsToShow = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setCardsToShow(1);
      } else if (width >= 640 && width < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(4);
      }
    };

    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);

    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + courses.length) % courses.length);

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % courses.length);

  const visibleCourses = courses.slice(currentIndex, currentIndex + cardsToShow);
  const coursesToShow =
    visibleCourses.length < cardsToShow
      ? [
          ...visibleCourses,
          ...courses.slice(0, cardsToShow - visibleCourses.length),
        ]
      : visibleCourses;

  return (
    <div className="flex flex-col items-center justify-center bg-white py-10 px-4 w-full">
      <h1 className="text-3xl font-bold uppercase mb-8 text-center bg-black text-transparent bg-clip-text">
        Latest Courses
      </h1>

      {loading && <p className="text-blue-500">Loading courses...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {courses.length > 0 && !loading && (
        <div className="relative flex items-center justify-center w-full max-w-[1500px]">
          {/* Prev Button */}
          <motion.button
            onClick={handlePrev}
            className="absolute left-2 bg-gray-800 text-white p-3 rounded-full shadow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ❮
          </motion.button>

          {/* Cards */}
          <div
            className="grid gap-8 mx-4 sm:mx-12 w-full"
            style={{
              gridTemplateColumns: `repeat(${cardsToShow}, minmax(0, 1fr))`,
            }}
          >
            {coursesToShow.map((course, index) => (
              <motion.div
                key={course.id || index}
                className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col w-full"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <img
                  src={
                    course.image?.url ||
                    "/placeholder.svg?height=224&width=400&query=course"
                  }
                  alt={course.title}
                  className="w-full h-56 object-contain bg-white"
                />

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {course.title}
                  </h3>

                  <p className="text-gray-600 mb-1">
                    Duration: {course.duration}
                  </p>

                  <p className="text-gray-800 font-bold mb-4">
                    ₹{course.price}
                  </p>

                  <a
                    className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition"
                    href={course.buylink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get This Course
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Next Button */}
          <motion.button
            onClick={handleNext}
            className="absolute right-2 bg-gray-800 text-white p-3 rounded-full shadow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ❯
          </motion.button>
        </div>
      )}
    </div>
  );
}

export default LatestCourse;
