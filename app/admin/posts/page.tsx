import { redirect } from "next/navigation";

export default function AdminPostsPage() {
  // This page is deprecated. Redirect to admin dashboard.
  // Post management now happens directly on individual post pages.
  redirect("/admin");
}
