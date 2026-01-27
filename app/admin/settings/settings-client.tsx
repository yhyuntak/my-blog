"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Globe, Home, Info, Share2, MessageSquare, Linkedin } from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const TipTapEditor = dynamic(() => import("@/components/editor/tiptap-editor"), {
  ssr: false,
  loading: () => (
    <div className="w-full min-h-[400px] rounded-lg border bg-background flex items-center justify-center text-muted-foreground">
      Loading editor...
    </div>
  ),
});

interface SettingsClientProps {
  initialData: {
    siteTitle: string;
    siteDescription: string;
    homeHeroTitle: string;
    homeHeroSubtitle: string;
    aboutTitle: string;
    aboutSubtitle: string;
    aboutContent: string;
    githubUrl: string;
    linkedinUrl: string;
    emailAddress: string;
    footerText: string;
  };
}

const sections = [
  { id: "general", label: "General", icon: Globe },
  { id: "home", label: "Home Hero", icon: Home },
  { id: "about", label: "About Page", icon: Info },
  { id: "social", label: "Social Links", icon: Share2 },
  { id: "footer", label: "Footer", icon: MessageSquare },
];

export function SettingsClient({ initialData }: SettingsClientProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("general");
  const [formData, setFormData] = useState(initialData);
  const [savingSection, setSavingSection] = useState<string | null>(null);

  const handleSaveSection = async (section: string) => {
    setSavingSection(section);

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
      alert(`${sections.find((s) => s.id === section)?.label} saved successfully!`);
    } catch (error) {
      console.error("Error saving settings:", error);
      alert(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setSavingSection(null);
    }
  };

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <nav className="w-64 space-y-1">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                activeSection === section.id
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {section.label}
            </button>
          );
        })}
      </nav>

      {/* Content */}
      <div className="flex-1 space-y-6">
        {/* General */}
        {activeSection === "general" && (
          <div className="space-y-6 p-6 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">General Settings</h2>
              <button
                onClick={() => handleSaveSection("general")}
                disabled={savingSection === "general"}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                {savingSection === "general" ? "Saving..." : "Save"}
              </button>
            </div>

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
                rows={3}
                className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>
        )}

        {/* Home Hero */}
        {activeSection === "home" && (
          <div className="space-y-6 p-6 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Home Hero Section</h2>
              <button
                onClick={() => handleSaveSection("home")}
                disabled={savingSection === "home"}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                {savingSection === "home" ? "Saving..." : "Save"}
              </button>
            </div>

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
                rows={3}
                className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>
        )}

        {/* About Page */}
        {activeSection === "about" && (
          <div className="space-y-6 p-6 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">About Page</h2>
              <button
                onClick={() => handleSaveSection("about")}
                disabled={savingSection === "about"}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                {savingSection === "about" ? "Saving..." : "Save"}
              </button>
            </div>

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
        )}

        {/* Social Links */}
        {activeSection === "social" && (
          <div className="space-y-6 p-6 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Social Links</h2>
              <button
                onClick={() => handleSaveSection("social")}
                disabled={savingSection === "social"}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                {savingSection === "social" ? "Saving..." : "Save"}
              </button>
            </div>

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
              <label htmlFor="linkedinUrl" className="block text-sm font-medium mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                id="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))
                }
                className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://linkedin.com/in/username"
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
        )}

        {/* Footer */}
        {activeSection === "footer" && (
          <div className="space-y-6 p-6 rounded-lg border bg-card">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Footer Settings</h2>
              <button
                onClick={() => handleSaveSection("footer")}
                disabled={savingSection === "footer"}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                {savingSection === "footer" ? "Saving..." : "Save"}
              </button>
            </div>

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
        )}
      </div>
    </div>
  );
}
