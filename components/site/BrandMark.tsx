/**
 * The BikinSaaS "BS" mark. One full-colour artwork serves both themes: on the
 * dark theme CSS lifts its darkest greens a little (`.brand-img`) so they do not
 * sink into the background.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      className={className ? `brand-img ${className}` : "brand-img"}
      src="/brand/logo.png"
      alt=""
      width={22}
      height={40}
    />
  );
}
