"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Course {
  _id: string;
  banner: string;
  link?: string;
  title: string;
  description?: string;
  price?: number;
  duration?: string;
  level?: "beginner" | "intermediate" | "advanced";
}

export default function CourseDisplay() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [visibleCourses, setVisibleCourses] = useState(9);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        if (!res.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await res.json();
        setCourses(data.data || []);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load courses. Please try again.";
        console.error("Error fetching courses:", err);
        setError(errorMessage);

        toast({
          variant: "destructive",
          title: "Error loading courses",
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [toast]);

  const showMoreCourses = () => {
    setVisibleCourses((prev) => prev + 9);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-background p-6">
      <div className="max-w-7xl w-full">
        <h2 className="text-3xl font-bold text-foreground text-center mb-6">
          Course List
        </h2>

        {loading && (
          <p className="text-center text-primary">Loading courses...</p>
        )}
        {error && (
          <p className="text-center text-destructive">{error}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {courses.length > 0 ? (
            courses.slice(0, visibleCourses).map((course, index) => (
              <motion.div
                key={course._id}
                className="bg-card shadow-lg rounded-lg p-4 flex flex-col"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-full h-56 relative bg-card">
                  <Image
                    src={
                      course.banner ||
                      "/placeholder.svg?height=224&width=400&query=course"
                    }
                    alt={course.title || "Course Image"}
                    fill
                    className="object-contain"
                  />
                </div>

                <h3 className="text-xl font-bold text-card-foreground mt-3">
                  {course.title || "No Title"}
                </h3>

                {course.duration && (
                  <p className="text-muted-foreground">
                    Duration: {course.duration}
                  </p>
                )}

                <p className="text-card-foreground font-semibold">
                  Price: {course.price != null ? `₹${course.price}` : "Free"}
                </p>

                {course.link && (
                  <a
                    className="mt-4 px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-md shadow-md hover:opacity-90 transition"
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get This Course
                  </a>
                )}
              </motion.div>
            ))
          ) : (
            !loading && (
              <p className="text-center text-muted-foreground">
                No courses available.
              </p>
            )
          )}
        </div>

        {visibleCourses < courses.length && (
          <div className="text-center mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={showMoreCourses}
              className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-md shadow-md hover:opacity-90 transition"
            >
              Show More
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}