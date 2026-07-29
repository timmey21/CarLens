import Link from "next/link";

export default function InstallGuide({
  query,
  partName,
}: {
  query: string;
  partName: string;
}) {
  const href = `/install-guide?query=${encodeURIComponent(query)}&partName=${encodeURIComponent(partName)}`;

  return (
    <Link
      href={href}
      className="font-mono text-xs font-bold uppercase tracking-wide text-muted transition hover:text-accent"
    >
      How to Install ↗
    </Link>
  );
}
