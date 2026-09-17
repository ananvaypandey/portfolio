export default function PencilLine({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 220 10"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M2 7 C 28 2, 48 8, 72 5 S 118 9, 148 5 S 196 8, 218 4"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}