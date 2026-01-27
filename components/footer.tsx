import { getSiteSettings } from "@/lib/settings";
import { FooterClient } from "./footer-client";

export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <FooterClient
      githubUrl={settings.githubUrl}
      linkedinUrl={settings.linkedinUrl}
      emailAddress={settings.emailAddress}
      footerText={settings.footerText}
    />
  );
}
