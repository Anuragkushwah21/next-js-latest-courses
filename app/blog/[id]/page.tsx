"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

interface BlogPost {
  name?: string
  importantDates?: string
  qualification?: string
  applyForm?: string
  downloadLink?: string
}

export default function BlogViewPage() {
  const { postId } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!postId) return

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blogview/${postId}`)
        if (!response.ok) throw new Error("Failed to fetch post")
        const data = await response.json()
        setPost(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
          <p className="text-foreground">{error || "Post not found"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center bg-background p-6 my-20">
      <div className="max-w-6xl w-full bg-card rounded-lg shadow-lg p-6 transition-transform duration-300 hover:shadow-xl">
        <h1 className="text-4xl font-bold mb-6 text-card-foreground">{post.name || "No Title Available"}</h1>

        <div className="space-y-4 text-card-foreground">
          {post.importantDates && (
            <p className="text-lg">
              <span className="font-semibold">Important Dates:</span>
              <span className="ml-2">{post.importantDates}</span>
            </p>
          )}

          {post.qualification && (
            <p className="text-lg">
              <span className="font-semibold">Qualification:</span>
              <span className="ml-2">{post.qualification}</span>
            </p>
          )}

          {post.applyForm && (
            <p className="text-lg">
              <span className="font-semibold">Apply Form:</span>
              <a
                href={post.applyForm}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-primary hover:underline transition-colors"
              >
                {post.applyForm}
              </a>
            </p>
          )}

          {post.downloadLink && (
            <p className="text-lg">
              <span className="font-semibold">Download Link:</span>
              <a
                href={post.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-primary hover:underline transition-colors"
              >
                {post.downloadLink}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
