/** An endless ticker of what we build. Pure CSS; pauses on hover. */
export function Marquee({ items }: { items: string[] }) {
  /* The list is doubled so the -50% translate loops without a seam. */
  const row = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((item, index) => (
          <span key={`${item}-${index}`}>
            {item}
            <i>✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}
