export default function TestimonialCard({
  quote,
  name,
  role,
  highlighted = false,
}: {
  quote: string;
  name: string;
  role: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl p-6 ${
        highlighted ? "bg-brand-500 text-white" : "border border-line bg-white"
      }`}
    >
      <div className={`mb-3 flex gap-0.5 ${highlighted ? "text-white" : "text-brand-500"}`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} />
        ))}
      </div>
      <p className={`flex-1 text-sm leading-relaxed ${highlighted ? "text-white/90" : "text-ink/80"}`}>
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-5 flex items-center gap-3">
        <div
          className={`h-9 w-9 rounded-full ${
            highlighted ? "bg-white/20" : "bg-brand-100"
          }`}
        />
        <div>
          <p className={`text-sm font-semibold ${highlighted ? "text-white" : "text-ink"}`}>
            {name}
          </p>
          <p className={`text-xs ${highlighted ? "text-white/70" : "text-muted"}`}>{role}</p>
        </div>
      </div>
    </div>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7L2 9.2l7.1-.6z" />
    </svg>
  );
}
