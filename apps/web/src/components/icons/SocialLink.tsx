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
  linkedin: { Icon: FaLinkedin, defaultLabel: "LinkedIn" },
  github: { Icon: FaGithub, defaultLabel: "GitHub" },
  email: { Icon: MdOutlineEmail, defaultLabel: "Email" },
} as const;

export function SocialLink({
  network,
  href,
  label,
  className = "btn gap-2",
  iconOnly = false,
}: SocialLinkProps) {
  const { Icon, defaultLabel } = config[network];
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
      <Icon className="h-4 w-4" aria-hidden />
      {!iconOnly && <span>{text}</span>}
    </a>
  );
}
