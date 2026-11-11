import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <div className="page wrap prose" data-scene="globe" data-scene-side="right">
      <h1 className="page-title">Privacy</h1>
      <div className="glass prose__body">
        <p>This site doesn&apos;t use analytics, advertising or tracking cookies.</p>
        <p>
          It remembers your choices in your own browser: theme, sound and visual quality in local storage (plus a{" "}
          <code>theme</code> cookie so the page loads in the right colours), and whether you&apos;ve seen the intro in
          session storage. None of this leaves your device.
        </p>
        <p>
          The assistant, Anu, runs entirely in your browser and doesn&apos;t send your questions anywhere. If you use
          its microphone button, your browser&apos;s own speech recognition handles the audio; some browsers, such as
          Chrome, process that on their servers.
        </p>
        <p>
          The contact form either opens your own email app with the message filled in, or, if a form service is
          configured, sends what you typed to it so it can be forwarded to me. I use what you send only to reply.
        </p>
        <p>
          To ask about or delete anything you&apos;ve sent, email <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </div>
    </div>
  );
}
