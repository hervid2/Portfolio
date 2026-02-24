interface ThemeIconProps {
  iconPath: string;
  iconPathDark?: string;
  alt: string;
  className?: string;
}

/**
 * Renders icon variants for dark/light mode using CSS visibility rules.
 *
 * @param props - Icon source and rendering attributes.
 * @returns Icon element pair controlled by theme class.
 */
export function ThemeIcon({ iconPath, iconPathDark, alt, className }: ThemeIconProps): JSX.Element {
  const darkPath = iconPathDark ?? iconPath;

  return (
    <>
      <img
        src={darkPath}
        alt={alt}
        className={`theme-icon-dark ${className ?? "h-4 w-4 object-contain"}`}
        loading="lazy"
      />
      <img
        src={iconPath}
        alt={alt}
        className={`theme-icon-light ${className ?? "h-4 w-4 object-contain"}`}
        loading="lazy"
      />
    </>
  );
}
