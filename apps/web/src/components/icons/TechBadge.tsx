import Link from "next/link";
import { TechIcon } from "@/components/icons/TechIcon";
import { getTechLabel } from "@/lib/tech-icons";

type TechBadgeProps = {
  name: string;
  icon?: string;
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  /** Show brand icon only; label appears on hover. */
  iconOnly?: boolean;
};

const sizeClass = {
  sm: "badge-sm gap-1",
  md: "gap-1.5",
  lg: "badge-lg gap-2",
} as const;

const iconSize = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
} as const;

const iconOnlySize = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const;

export function TechBadge({
  name,
  icon,
  href,
  className,
  size = "sm",
  iconOnly = false,
}: TechBadgeProps) {
  const iconKey = icon ?? name;
  const label = getTechLabel(name);
  const content = iconOnly ? (
    <TechIcon name={iconKey} className={iconOnlySize[size]} />
  ) : (
    <>
      <TechIcon name={iconKey} className={iconSize[size]} title={label} />
      <span>{label}</span>
    </>
  );

  const classes = iconOnly
    ? `tooltip tooltip-bottom before:text-xs before:whitespace-nowrap inline-flex items-center justify-center ${className ?? ""}`.trim()
    : `badge inline-flex items-center ${sizeClass[size]} ${className ?? "badge-outline font-mono"}`.trim();

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(iconOnly ? { "data-tip": label } : {})}
        aria-label={label}
      >
        {content}
      </Link>
    );
  }

  return (
    <span
      className={classes}
      {...(iconOnly ? { "data-tip": label } : {})}
      aria-label={label}
    >
      {content}
    </span>
  );
}
