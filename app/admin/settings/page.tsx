import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSiteSettings } from "@/lib/settings";
import { SettingsClient } from "./settings-client";

export default async function AdminSettingsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  const settings = await getSiteSettings();

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure your blog's general settings and content
          </p>
        </div>

        <SettingsClient initialData={settings} />
      </div>
    </div>
  );
}
