'use client';

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Blog = {
  _id: string;
  poster: string;
  link?: string;
  title: string;
  description: string;
  createdAt?: string;
};

type BlogFormValues = {
  link: string;
  title: string;
  description: string;
};

const emptyForm: BlogFormValues = {
  link: "",
  title: "",
  description: "",
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // shared form state
  const [form, setForm] = useState<BlogFormValues>(emptyForm);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // null = create, else edit
  const [editingId, setEditingId] = useState<string | null>(null);

  // load blogs
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/blogs");
        const data = await res.json();
        setBlogs(data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleChange(field: keyof BlogFormValues, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setPosterFile(null);
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!posterFile && !editingId) {
      toast.error("Please choose poster image file");
      return;
    }
    if (!form.title || !form.description) {
      toast.error("Title and description are required");
      return;
    }

    try {
      setSubmitting(true);
      const fd = new FormData();
      if (posterFile) fd.append("posterFile", posterFile);
      fd.append("title", form.title);
      fd.append("description", form.description);
      if (form.link) fd.append("link", form.link);
      if (editingId) fd.append("id", editingId);

      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();

      if (!res.ok) {
        const msg = data.message || "Failed to save blog";
        toast.error(msg);
      } else {
        const saved: Blog = data.data;
        if (editingId) {
          setBlogs((prev) =>
            prev.map((b) => (b._id === editingId ? saved : b))
          );
          toast.success("Blog updated");
        } else {
          setBlogs((prev) => [saved, ...prev]);
          toast.success("Blog created");
        }
        resetForm();
      }
    } catch {
      toast.error("Error saving blog");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this blog?")) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.message || "Failed to delete blog";
        toast.error(msg);
      } else {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
        toast.success("Blog deleted");
        if (editingId === id) resetForm();
      }
    } catch {
      toast.error("Error deleting blog");
    }
  }

  function startEdit(blog: Blog) {
    setEditingId(blog._id);
    setForm({
      link: blog.link || "",
      title: blog.title,
      description: blog.description,
    });
    setPosterFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-gray-100 py-6 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        {/* Form */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
            <h1 className="text-xl sm:text-2xl font-bold">
              {editingId ? "Edit Blog" : "Post Blog"}
            </h1>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs sm:text-sm text-gray-600 hover:underline"
              >
                Cancel edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4"
          >
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Poster Image (file)
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full rounded-md border px-3 py-2 text-xs sm:text-sm bg-white"
                onChange={(e) =>
                  setPosterFile(e.target.files?.[0] || null)
                }
              />
              <p className="mt-1 text-[11px] sm:text-xs text-gray-500">
                {editingId
                  ? "If you don't choose a file, old poster will stay."
                  : "Required for new blog."}
              </p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Link (optional)
              </label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2 text-xs sm:text-sm"
                value={form.link}
                onChange={(e) => handleChange("link", e.target.value)}
                placeholder="https://your-blog-link.com"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                className="w-full rounded-md border px-3 py-2 text-xs sm:text-sm"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                className="w-full rounded-md border px-3 py-2 text-xs sm:text-sm min-h-[140px] sm:min-h-[160px]"
                value={form.description}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 sm:mt-2 w-full sm:w-auto rounded-md bg-purple-600 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Saving..."
                : editingId
                ? "Update Blog"
                : "Publish Blog"}
            </button>
          </form>
        </div>

        {/* Blogs list */}
        <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
            All Blogs
          </h2>

          {loading ? (
            <p className="text-xs sm:text-sm text-gray-500">
              Loading blogs...
            </p>
          ) : blogs.length === 0 ? (
            <p className="text-xs sm:text-sm text-gray-500">
              No blogs found.
            </p>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <article
                  key={blog._id}
                  className="border rounded-lg p-3 sm:p-4 flex flex-col gap-2 sm:gap-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    <div className="w-full sm:w-32 md:w-40">
                      {blog.poster && (
                        <img
                          src={blog.poster}
                          alt={blog.title}
                          className="w-full h-32 sm:h-24 md:h-28 object-cover rounded-md border"
                        />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base">
                            {blog.title}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-gray-500">
                            {blog.createdAt
                              ? new Date(blog.createdAt).toLocaleString()
                              : ""}
                          </p>
                          {blog.link && (
                            <a
                              href={blog.link}
                              target="_blank"
                              className="inline-block mt-1 text-[11px] sm:text-xs text-blue-600 hover:underline"
                            >
                              Visit link
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => startEdit(blog)}
                            className="px-2 py-1 text-[11px] sm:text-xs rounded-md border text-gray-700 hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="px-2 py-1 text-[11px] sm:text-xs rounded-md bg-red-600 text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-700 line-clamp-3">
                        {blog.description}
                      </p>
                    </div>
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