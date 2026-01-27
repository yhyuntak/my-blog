"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Edit2, X, Check } from "lucide-react";
import Link from "next/link";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string | null; // Nullable for deleted users
  authorName: string;
  authorImage: string | null;
  authorRole: string;
  authorGithubUsername: string | null;
}

interface CommentsProps {
  postSlug: string;
}

export function Comments({ postSlug }: CommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);
      const res = await fetch(`/api/comments?postSlug=${postSlug}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment, postSlug }),
      });

      if (res.ok) {
        setNewComment("");
        await fetchComments();
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editContent.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });

      if (res.ok) {
        setEditingId(null);
        setEditContent("");
        await fetchComments();
      }
    } catch (error) {
      console.error("Failed to update comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchComments();
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 pt-8 border-t">
      <h3 className="text-2xl font-semibold mb-6">
        Comments ({comments.length})
      </h3>

      {session?.user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            {session.user.image && (
              <img
                src={session.user.image}
                alt={session.user.name || "User"}
                className="h-10 w-10 rounded-full"
              />
            )}
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !newComment.trim()}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {loading ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 rounded-lg bg-secondary/50 text-center">
          <p className="text-muted-foreground">
            <Link
              href="/auth/signin"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>{" "}
            to leave a comment
          </p>
        </div>
      )}

      <div className="space-y-6">
        {isLoadingComments ? (
          <p className="text-center text-muted-foreground">
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {comment.authorImage && (
                <img
                  src={comment.authorImage}
                  alt={comment.authorName}
                  className="h-10 w-10 rounded-full"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {comment.authorGithubUsername ? (
                    <a
                      href={`https://github.com/${comment.authorGithubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-primary transition-colors cursor-pointer"
                    >
                      {comment.authorName}
                    </a>
                  ) : (
                    <span className="font-medium">{comment.authorName}</span>
                  )}
                  {comment.authorRole === "admin" && (
                    <span className="px-2 py-0.5 text-xs rounded-md bg-primary/10 text-primary">
                      Admin
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                {editingId === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(comment.id)}
                        disabled={loading}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                      >
                        <Check className="h-3 w-3" />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditContent("");
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-md hover:bg-secondary cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-foreground whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                    {session?.user &&
                      comment.userId &&
                      (session.user.id === comment.userId ||
                        session.user.role === "admin") && (
                        <div className="flex gap-2 mt-2">
                          {session.user.id === comment.userId && (
                            <button
                              onClick={() => {
                                setEditingId(comment.id);
                                setEditContent(comment.content);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md hover:bg-secondary text-muted-foreground cursor-pointer"
                            >
                              <Edit2 className="h-3 w-3" />
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(comment.id)}
                            disabled={loading}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md hover:bg-destructive/10 text-destructive disabled:opacity-50 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
