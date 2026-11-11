import Link from "next/link";
import { Label, RevealLines } from "@/components/ui/RevealLines";

export default function NotFound() {
  return (
    <div className="page wrap not-found" data-scene="tree" data-scene-side="right">
      <div data-reveal>
        <Label>404</Label>
      </div>
      <RevealLines as="h1" className="page-title" lines={["Lost in", <em key="b">the woods</em>]} />
      <p className="page-lede" data-reveal>
        This page isn&apos;t here. The link may be old, or the project may have a new address.
      </p>
      <div className="case__actions" data-reveal>
        <Link href="/projects" className="pill pill--solid" data-magnetic>
          Browse my work <span aria-hidden="true">↳</span>
        </Link>
        <Link href="/" className="pill">
          Go home
        </Link>
      </div>
    </div>
  );
}
