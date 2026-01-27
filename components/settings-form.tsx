"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import dynamic from "next/dynamic";

const TipTapEditor = dynamic(() => import("./editor/tiptap-editor"), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[400px] rounded-lg border bg-background flex items-center justify-center text-muted-foreground">
      Loading editor...
    </div>
  ),
});

interface SettingsFormProps {
  initialData: {
    siteTitle: string;
    siteDescription: string;
    homeHeroTitle: string;
    homeHeroSubtitle: string;
    aboutTitle: string;
    aboutSubtitle: string;
    aboutContent: string;
    githubUrl: string;
    twitterUrl: string;
    emailAddress: string;
    footerText: string;
  };
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      router.refresh();
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* General Settings */}
      <div className="space-y-4 p-6 rounded-lg border bg-card">
        <h2 className="text-xl font-semibold">General</h2>

        <div>
          <label htmlFor="siteTitle" className="block text-sm font-medium mb-2">
            Site Title
          </label>
          <input
            type="text"
            id="siteTitle"
            value={formData.siteTitle}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, siteTitle: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="siteDescription" className="block text-sm font-medium mb-2">
            Site Description
          </label>
          <textarea
            id="siteDescription"
            value={formData.siteDescription}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, siteDescription: e.target.value }))
            }
            rows={2}
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>
      </div>

      {/* Home Hero */}
      <div className="space-y-4 p-6 rounded-lg border bg-card">
        <h2 className="text-xl font-semibold">Home Hero Section</h2>

        <div>
          <label htmlFor="homeHeroTitle" className="block text-sm font-medium mb-2">
            Hero Title
          </label>
          <input
            type="text"
            id="homeHeroTitle"
            value={formData.homeHeroTitle}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, homeHeroTitle: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="homeHeroSubtitle" className="block text-sm font-medium mb-2">
            Hero Subtitle
          </label>
          <textarea
            id="homeHeroSubtitle"
            value={formData.homeHeroSubtitle}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, homeHeroSubtitle: e.target.value }))
            }
            rows={2}
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>
      </div>

      {/* About Page */}
      <div className="space-y-4 p-6 rounded-lg border bg-card">
        <h2 className="text-xl font-semibold">About Page</h2>

        <div>
          <label htmlFor="aboutTitle" className="block text-sm font-medium mb-2">
            About Title
          </label>
          <input
            type="text"
            id="aboutTitle"
            value={formData.aboutTitle}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, aboutTitle: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="aboutSubtitle" className="block text-sm font-medium mb-2">
            About Subtitle
          </label>
          <input
            type="text"
            id="aboutSubtitle"
            value={formData.aboutSubtitle}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, aboutSubtitle: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            About Content (Markdown)
          </label>
          <TipTapEditor
            content={formData.aboutContent}
            onChange={(markdown) =>
              setFormData((prev) => ({ ...prev, aboutContent: markdown }))
            }
            placeholder="Write about yourself and your blog..."
            className="h-[400px]"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4 p-6 rounded-lg border bg-card">
        <h2 className="text-xl font-semibold">Social Links</h2>

        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium mb-2">
            GitHub URL
          </label>
          <input
            type="url"
            id="githubUrl"
            value={formData.githubUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://github.com/username"
          />
        </div>

        <div>
          <label htmlFor="twitterUrl" className="block text-sm font-medium mb-2">
            Twitter URL
          </label>
          <input
            type="url"
            id="twitterUrl"
            value={formData.twitterUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, twitterUrl: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://twitter.com/username"
          />
        </div>

        <div>
          <label htmlFor="emailAddress" className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="emailAddress"
            value={formData.emailAddress}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, emailAddress: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="your@email.com"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-4 p-6 rounded-lg border bg-card">
        <h2 className="text-xl font-semibold">Footer</h2>

        <div>
          <label htmlFor="footerText" className="block text-sm font-medium mb-2">
            Footer Text
          </label>
          <input
            type="text"
            id="footerText"
            value={formData.footerText}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, footerText: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-6 border-t">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
