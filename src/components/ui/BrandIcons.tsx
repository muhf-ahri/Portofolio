import type { SVGProps } from "react";

/**
 * Lucide v1 removed brand/trademark glyphs, so the ones we need live here.
 * Each renders `aria-hidden` — the consumer must supply the accessible name.
 */

type BrandIconProps = SVGProps<SVGSVGElement> & { size?: number | string };

function BrandGlyph({ size = 24, d, ...rest }: BrandIconProps & { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}

export function GithubIcon(props: BrandIconProps) {
  return (
    <BrandGlyph
      {...props}
      d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
    />
  );
}

export function LinkedinIcon(props: BrandIconProps) {
  return (
    <BrandGlyph
      {...props}
      d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11.5H3V9.75Zm7 0h3.83v1.57h.05a4.2 4.2 0 0 1 3.78-2.07c4.04 0 4.79 2.66 4.79 6.12v5.88h-4v-5.21c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.3h-4V9.75Z"
    />
  );
}

export function InstagramIcon(props: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={props.size ?? 24}
      height={props.size ?? 24}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FigmaIcon(props: BrandIconProps) {
  return (
    <BrandGlyph
      {...props}
      d="M8.5 2h3.5v7H8.5a3.5 3.5 0 1 1 0-7Zm3.5 0H15a3.5 3.5 0 1 1 0 7h-3V2Zm0 7h3.28a3.5 3.5 0 1 1 0 7H12V9Zm0 7H8.5a3.5 3.5 0 1 0 0 7H12v-7Zm0 7V2h-.04C8.05 2 5 5.05 5 8.46c0 1.92.86 3.6 2.22 4.63A3.5 3.5 0 0 0 8.5 23c1.1 0 2.11-.5 2.75-1.28A3.5 3.5 0 0 0 12 23c1.93 0 3.5-1.57 3.5-3.5 0-.34-.05-.67-.13-.98.76-.6 1.24-1.5 1.24-2.52 0-.35-.05-.68-.13-1-.36-.83-1.07-1.5-1.98-1.79.2-.35.31-.76.31-1.19 0-1.93-1.57-3.5-3.5-3.5H12V9Z"
    />
  );
}
