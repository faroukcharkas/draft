"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";

const sidebarItemStyles = cva(
  "py-2 px-4 mx-[-16px] rounded-xl",
  {
    variants: {
      active: {
        true: "bg-popover shadow-sm",
        false: "text-muted-foreground",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

interface SidebarItemProps extends VariantProps<typeof sidebarItemStyles> {
  children: React.ReactNode;
  href: string;
  icon: React.ReactNode;
}

export default function SidebarItem({
  children,
  href,
  icon,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={sidebarItemStyles({ active: isActive })}
    >
      <div className="flex items-center gap-2 font-sans">
        {icon}
        {children}
      </div>
    </Link>
  );
}
