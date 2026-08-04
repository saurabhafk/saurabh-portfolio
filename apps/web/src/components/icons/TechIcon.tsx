import { getTechIcon } from "@/lib/tech-icons";

type TechIconProps = {
  name: string;
  className?: string;
  title?: string;
};

export function TechIcon({ name, className = "h-4 w-4", title }: TechIconProps) {
  const Icon = getTechIcon(name);
  if (!Icon) return null;
  return <Icon className={className} aria-hidden title={title ?? name} />;
}
