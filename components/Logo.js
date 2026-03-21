export default function Logo({ withWordmark = true }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Renwize logo"
      >
        <path
          d="M18 3.5C10 3.5 3.5 10 3.5 18C3.5 26 10 32.5 18 32.5C24.3 32.5 29.6 28.4 31.5 22.7"
          stroke="#1FA168"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M29.5 8.5V15.5H22.5"
          stroke="#1FA168"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M10 14H23" stroke="#1FA168" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 18H20" stroke="#1FA168" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 22H17" stroke="#1FA168" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      {withWordmark ? (
        <span className="text-2xl font-bold tracking-tight text-[#1E254A]">Renwize</span>
      ) : null}
    </div>
  );
}
