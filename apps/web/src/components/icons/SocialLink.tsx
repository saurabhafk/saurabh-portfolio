import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";

type SocialLinkProps = {
  network: "linkedin" | "github" | "email";
  href: string;
  label?: string;
  className?: string;
  iconOnly?: boolean;
};

const config = {
  linkedin: {
    Icon: FaLinkedin,
    defaultLabel: "LinkedIn",
    color: "#0A66C2",
  },
  github: {
    Icon: FaGithub,
    defaultLabel: "GitHub",
    color: "#181717",
  },
  email: {
    Icon: MdOutlineEmail,
    defaultLabel: "Email",
    color: "#EA4335",
  },
} as const;

export function SocialLink({
  network,
  href,
  label,
  className = "btn gap-2",
  iconOnly = false,
}: SocialLinkProps) {
  const { Icon, defaultLabel, color } = config[network];
  const text = label ?? defaultLabel;
  const external = network !== "email";

  return (
    <a
      href={href}
      className={className}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      aria-label={text}
    >
      <Icon
        className={`h-4 w-4 shrink-0${network === "github" ? " tech-icon-github" : ""}`}
        aria-hidden
        style={{ color }}
      />
      {!iconOnly && <span>{text}</span>}
    </a>
  );
}
