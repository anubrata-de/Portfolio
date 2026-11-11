import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <div className="page wrap prose">
      <h1 className="page__title">Privacy</h1>
      <p>This site doesn&apos;t use analytics, advertising, tracking or cookies, and it doesn&apos;t store anything in your browser.</p>
      <p>
        The contact form either opens your own email app with the message filled in, or, if a form service is configured,
        sends what you typed to it so it can be forwarded to me. I use what you send only to reply.
      </p>
      <p>
        To ask about or delete anything you&apos;ve sent, email <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </div>
  );
}
