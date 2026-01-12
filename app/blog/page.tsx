"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"

interface BlogPost {
  _id: string
  name: string
  importantDates?: string
  qualification?: string
  applyForm?: string
  downloadLink?: string
}

const BlogView = () => {
  const { postId } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!postId) return

    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api/blogview/${postId}`)
        setPost(data.data)
        console.log(data)
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Error fetching post"
        console.error("Error fetching post:", errorMessage)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  if (error) {
    return <div className="text-center text-xl font-bold mt-10 text-destructive">Error: {error}</div>
  }

  return (
    <div className="flex justify-center items-center bg-muted p-6 my-20">
      <div className="max-w-6xl w-full bg-card rounded-xl shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl">
        <h1 className="text-3xl font-bold mb-4 underline text-card-foreground">{post?.name || "No Title Available"}</h1>

        {post?.importantDates && (
          <p className="text-card-foreground text-lg">
            <span className="font-semibold">Important Dates: </span>
            {post.importantDates}
          </p>
        )}

        {post?.qualification && (
          <p className="text-lg text-card-foreground">
            <span className="font-semibold">Qualification: </span>
            {post.qualification}
          </p>
        )}

        {post?.applyForm && (
          <p className="text-lg text-primary">
            <span className="font-semibold text-card-foreground">Apply Form: </span>
            <a
              href={post.applyForm}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary/80"
            >
              {post.applyForm}
            </a>
          </p>
        )}

        {post?.downloadLink && (
          <p className="text-lg text-primary">
            <span className="font-semibold text-card-foreground">Download Link: </span>
            <a
              href={post.downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary/80"
            >
              {post.downloadLink}
            </a>
          </p>
        )}
      </div>
    </div>
  )
}

export default BlogView
