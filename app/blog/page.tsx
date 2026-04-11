"use client";

import { useEffect, useState } from "react";

type BlogPost = {
  _id: string;
  poster: string;
  link?: string;
  title: string;
  description: string;
  createdAt?: string;
};

const BlogView = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/blogs");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch blogs");
        }

        // data.data should be BlogPost[]
        setPosts(data.data || []);
      } catch (err: any) {
        console.error("Error fetching blogs:", err);
        setError(err.message || "Error fetching blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg text-muted-foreground">Loading blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-center text-xl font-bold text-destructive">
          Error: {error}
        </p>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg text-muted-foreground">No blogs found.</p>
      </div>
    );
  }

  return (
    <div className="bg-muted px-4 py-10 sm:py-16">
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post._id}
            className="bg-card rounded-xl shadow-lg overflow-hidden flex flex-col"
          >
            {post.poster && (
              <div className="w-full h-48 sm:h-56 overflow-hidden">
                <img
                  src={post.poster}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-5 sm:p-6 flex flex-col gap-3 flex-1">
              <header className="space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-card-foreground line-clamp-2">
                  {post.title}
                </h2>
                {post.createdAt && (
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                )}
              </header>

              <p className="text-sm sm:text-base text-card-foreground line-clamp-3">
                {post.description}
              </p>

              {post.link && (
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center text-sm text-primary underline hover:text-primary/80"
                >
                  Visit link
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogView;