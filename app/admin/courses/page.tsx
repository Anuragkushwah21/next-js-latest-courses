// app/admin/courses/page.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Course = {
  _id: string;
  banner: string;
  link?: string;
  title: string;
  description?: string;
  price?: number;
  duration?: string;
  level?: "beginner" | "intermediate" | "advanced";
  createdAt?: string;
  updatedAt?: string;
};

type CourseFormValues = {
  link: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
};

const emptyForm: CourseFormValues = {
  link: "",
  title: "",
  description: "",
  price: "",
  duration: "",
  level: "beginner",
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<CourseFormValues>(emptyForm);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // null = create, otherwise edit
  const [editingId, setEditingId] = useState<string | null>(null);

  // load all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/courses");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch courses");
        }

        setCourses(data.data || []);
      } catch (err: any) {
        console.error("Error fetching courses:", err);
        toast.error(err.message || "Error fetching courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  function handleChange(field: keyof CourseFormValues, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setBannerFile(null);
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!bannerFile && !editingId) {
      toast.error("Banner file is required for new course");
      return;
    }
    if (!form.title) {
      toast.error("Title is required");
      return;
    }

    try {
      setSubmitting(true);

      const fd = new FormData();
      if (bannerFile) fd.append("bannerFile", bannerFile);
      fd.append("title", form.title);
      if (form.link) fd.append("link", form.link);
      if (form.description) fd.append("description", form.description);
      if (form.price) fd.append("price", form.price);
      if (form.duration) fd.append("duration", form.duration);
      if (form.level) fd.append("level", form.level);
      if (editingId) fd.append("id", editingId);

      const res = await fetch("/api/courses", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to save course");
      } else {
        const saved: Course = data.data;
        if (editingId) {
          setCourses((prev) =>
            prev.map((c) => (c._id === editingId ? saved : c))
          );
          toast.success("Course updated");
        } else {
          setCourses((prev) => [saved, ...prev]);
          toast.success("Course created");
        }
        resetForm();
      }
    } catch {
      toast.error("Error creating/updating course");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this course?")) return;

    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to delete course");
      } else {
        setCourses((prev) => prev.filter((c) => c._id !== id));
        toast.success("Course deleted");
        if (editingId === id) resetForm();
      }
    } catch {
      toast.error("Error deleting course");
    }
  }

  function startEdit(course: Course) {
    setEditingId(course._id);
    setForm({
      link: course.link || "",
      title: course.title,
      description: course.description || "",
      price: course.price != null ? String(course.price) : "",
      duration: course.duration || "",
      level: course.level || "beginner",
    });
    setBannerFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Form */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">
              {editingId ? "Edit Course" : "Post Course"}
            </h1>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm text-gray-600 hover:underline"
              >
                Cancel edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Banner (file only)
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full rounded-md border px-3 py-2 text-sm bg-white"
                onChange={(e) =>
                  setBannerFile(e.target.files?.[0] || null)
                }
              />
              <p className="mt-1 text-xs text-gray-500">
                {editingId
                  ? "If you don't select a file, existing banner will remain."
                  : "Required for new course."}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Link (optional)
              </label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={form.link}
                onChange={(e) => handleChange("link", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description (optional)
              </label>
              <textarea
                className="w-full rounded-md border px-3 py-2 text-sm min-h-[80px]"
                value={form.description}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Price (optional)
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={form.price}
                  onChange={(e) =>
                    handleChange("price", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Duration (optional)
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={form.duration}
                  onChange={(e) =>
                    handleChange("duration", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Level (optional)
              </label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={form.level}
                onChange={(e) =>
                  handleChange(
                    "level",
                    e.target.value as
                      | "beginner"
                      | "intermediate"
                      | "advanced"
                  )
                }
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Saving..."
                : editingId
                ? "Update Course"
                : "Create Course"}
            </button>
          </form>
        </div>

        {/* Courses list */}
        <section className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">All Courses</h2>

          {loading ? (
            <p className="text-sm text-gray-500">Loading courses...</p>
          ) : courses.length === 0 ? (
            <p className="text-sm text-gray-500">No courses found.</p>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <article
                  key={course._id}
                  className="border rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4"
                >
                  <div className="w-full sm:w-32 md:w-40">
                    {course.banner && (
                      <Image
                        src={course.banner}
                        alt={course.title}
                        width={160}
                        height={112}
                        className="w-full h-28 sm:h-24 md:h-28 object-cover rounded-md border"
                      />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base">
                          {course.title}
                        </h3>
                        {course.price != null && (
                          <p className="text-xs sm:text-sm text-gray-700">
                            Price: ₹{course.price}
                          </p>
                        )}
                        {course.duration && (
                          <p className="text-xs sm:text-sm text-gray-700">
                            Duration: {course.duration}
                          </p>
                        )}
                        {course.level && (
                          <p className="text-xs sm:text-sm text-gray-700">
                            Level: {course.level}
                          </p>
                        )}
                        {course.link && (
                          <a
                            href={course.link}
                            target="_blank"
                            className="inline-block mt-1 text-[11px] sm:text-xs text-blue-600 hover:underline"
                          >
                            Visit course
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => startEdit(course)}
                          className="px-2 py-1 text-[11px] sm:text-xs rounded-md border text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="px-2 py-1 text-[11px] sm:text-xs rounded-md bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {course.description && (
                      <p className="text-xs sm:text-sm text-gray-700 line-clamp-3">
                        {course.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}