/**
 * The BS monogram. The green artwork reads on the light theme and the white one
 * on the dark theme, so both are in the markup and CSS (`[data-theme]`) shows
 * the right one — no flash, no client JavaScript. `variant="white"` pins the
 * white version, for surfaces that are always dark (the footer).
 */
export function BrandMark({
  variant = "auto",
  className,
}: {
  variant?: "auto" | "white";
  className?: string;
}) {
  const cls = className ? `brand-img ${className}` : "brand-img";
  return (
    <>
      {variant === "auto" ? (
        <img className={`${cls} brand-img-green`} src="/brand/logo-green.png" alt="" width={36} height={36} />
      ) : null}
      <img className={`${cls} brand-img-white`} src="/brand/logo-white.png" alt="" width={36} height={36} />
    </>
  );
}
