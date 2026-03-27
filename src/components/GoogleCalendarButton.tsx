interface GoogleCalendarButtonProps {
  className?: string;
}

export default function GoogleCalendarButton({ className = "" }: GoogleCalendarButtonProps) {
  const handleClick = () => {
    window.open("https://calendar.google.com", "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-[0.98] ${className}`}
      title="Open Google Calendar"
    >
      {/* Google Calendar icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <rect x="10" y="8" width="28" height="34" rx="3" fill="#fff" stroke="#4285F4" strokeWidth="2" />
        <rect x="10" y="8" width="28" height="10" rx="3" fill="#4285F4" />
        <rect x="16" y="6" width="2" height="6" rx="1" fill="#1A73E8" />
        <rect x="30" y="6" width="2" height="6" rx="1" fill="#1A73E8" />
        <rect x="16" y="22" width="4" height="4" rx="0.5" fill="#EA4335" />
        <rect x="22" y="22" width="4" height="4" rx="0.5" fill="#34A853" />
        <rect x="28" y="22" width="4" height="4" rx="0.5" fill="#FBBC04" />
        <rect x="16" y="28" width="4" height="4" rx="0.5" fill="#FBBC04" />
        <rect x="22" y="28" width="4" height="4" rx="0.5" fill="#4285F4" />
        <rect x="28" y="28" width="4" height="4" rx="0.5" fill="#EA4335" />
        <rect x="16" y="34" width="4" height="4" rx="0.5" fill="#34A853" />
        <rect x="22" y="34" width="4" height="4" rx="0.5" fill="#EA4335" />
      </svg>
      Google Calendar
    </button>
  );
}
