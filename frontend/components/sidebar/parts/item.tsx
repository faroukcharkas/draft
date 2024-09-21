import Link from "next/link";

export default function SidebarItem({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="py-2 px-4"
    >
      {children}
    </Link>
  );
}
