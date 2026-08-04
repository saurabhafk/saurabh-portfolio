import Link from "next/link";
import { TechIcon } from "@/components/icons/TechIcon";
import { getTechLabel } from "@/lib/tech-icons";

type TechBadgeProps = {
  name: string;
  icon?: string;
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClass = {
  sm: "badge-sm gap-1",
  md: "gap-1.5",
  lg: "badge-lg gap-2",
} as const;

const iconSize = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
} as const;

export function TechBadge({
  name,
  icon,
  href,
  className = "badge-outline font-mono",
  size = "sm",
}: TechBadgeProps) {
  const iconKey = icon ?? name;
  const label = getTechLabel(name);
  const content = (
    <>
      <TechIcon name={iconKey} className={iconSize[size]} title={label} />
      <span>{label}</span>
    </>
  );

  const classes = `badge inline-flex items-center ${sizeClass[size]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <span className={classes}>{content}</span>;
}
