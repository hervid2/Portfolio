import { motion } from "motion/react";
import { ThemeIcon } from "@/components/ui/ThemeIcon";
import { useLanguage } from "@/hooks/useLanguage";
import { fadeUpVariants, HOVER_LIFT_Y_SMALL, HOVER_SPRING } from "@/utils/motionPresets";

interface AlternativeContactLink {
  href: string;
  label: string;
  iconPath: string;
  iconPathDark?: string;
  iconAlt: string;
}

const ALTERNATIVE_CONTACT_LINKS: readonly AlternativeContactLink[] = [
  {
    href: "https://github.com/hervid2",
    label: "GitHub",
    iconPath: "/assets/icons/social/github.svg",
    iconPathDark: "/assets/icons/social/github-dark.svg",
    iconAlt: "GitHub icon"
  },
  {
    href: "https://www.linkedin.com/in/hern%C3%A1n-david-cardona-becerra/",
    label: "LinkedIn",
    iconPath: "/assets/icons/social/linkedin.svg",
    iconAlt: "LinkedIn icon"
  }
];

/**
 * Renders the alternative contact block: GitHub and LinkedIn links that open in a new tab.
 *
 * @returns Alternative contact card element.
 */
export function ContactAlternatives(): JSX.Element {
  const { dictionary } = useLanguage();

  return (
    <motion.div
      variants={fadeUpVariants}
      className="mt-10 rounded-2xl border border-border-subtle bg-surface-card p-6"
    >
      <h3 className="text-lg font-semibold text-text-primary">
        {dictionary.contact.altContactTitle}
      </h3>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
        {ALTERNATIVE_CONTACT_LINKS.map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            className={
              "inline-flex items-center gap-2 rounded-md border border-border-subtle px-3 py-2 " +
              "transition-[color,border-color] duration-200 hover:border-accent-cyan " +
              "hover:text-accent-cyan"
            }
            rel="noopener noreferrer"
            target="_blank"
            whileHover={{ y: HOVER_LIFT_Y_SMALL, transition: HOVER_SPRING }}
          >
            <ThemeIcon
              iconPath={link.iconPath}
              iconPathDark={link.iconPathDark}
              alt={link.iconAlt}
              className="h-4 w-4 object-contain"
            />
            {link.label}
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
