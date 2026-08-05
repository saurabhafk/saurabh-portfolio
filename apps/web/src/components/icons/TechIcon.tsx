import { getTechColor, getTechIcon, resolveTechKey } from "@/lib/tech-icons";

type TechIconProps = {
  name: string;
  className?: string;
  title?: string;
  /** When false, inherits text color. Default true = brand color. */
  branded?: boolean;
};

const DARK_INVERT_KEYS = new Set([
  "github",
  "expo",
  "ios",
  "apple-maps",
  "socket-io",
]);

export function TechIcon({
  name,
  className = "h-4 w-4",
  title,
  branded = true,
}: TechIconProps) {
  const Icon = getTechIcon(name);
  if (!Icon) return null;
  const key = resolveTechKey(name);
  const color = branded ? getTechColor(name) : undefined;
  const invertClass =
    branded && key && DARK_INVERT_KEYS.has(key) ? `tech-icon-${key}` : "";

  return (
    <Icon
      className={[className, invertClass].filter(Boolean).join(" ")}
      aria-hidden
      title={title ?? name}
      style={color ? { color } : undefined}
    />
  );
}
