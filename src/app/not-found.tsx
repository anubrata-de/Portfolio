import Link from "next/link";
import { Episode } from "@/components/ui/Episode";

export default function NotFound() {
  return (
    <div className="page wrap not-found">
      <Episode n={4}>Missing episode</Episode>
      <h1 className="page__title">This episode doesn&apos;t exist</h1>
      <p className="page__lead">The link may be old, or the project may have a new address.</p>
      <p className="about__end">
        <Link href="/projects" className="button">
          Browse my work
        </Link>
        <Link href="/" className="button button--ghost">
          Go home
        </Link>
      </p>
    </div>
  );
}
