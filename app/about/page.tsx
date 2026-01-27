import { getSiteSettings } from "@/lib/settings";
import AboutClient from "./about-client";
import { marked } from "marked";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: `${settings.aboutTitle} | ${settings.siteTitle}`,
    description: settings.aboutSubtitle,
  };
}

export default async function AboutPage() {
  const settings = await getSiteSettings();

  // Convert markdown to HTML
  const aboutContentHtml = await marked(settings.aboutContent);

  return (
    <AboutClient
      aboutTitle={settings.aboutTitle}
      aboutSubtitle={settings.aboutSubtitle}
      aboutContent={aboutContentHtml}
      githubUrl={settings.githubUrl}
      linkedinUrl={settings.linkedinUrl}
      emailAddress={settings.emailAddress}
    />
  );
}
