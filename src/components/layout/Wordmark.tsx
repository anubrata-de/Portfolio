import Link from "next/link";

export function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label="Anubrata De, home">
      anubrata<span>.de</span>
    </Link>
  );
}
