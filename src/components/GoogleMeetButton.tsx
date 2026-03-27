interface GoogleMeetButtonProps {
  className?: string;
}

export default function GoogleMeetButton({ className = "" }: GoogleMeetButtonProps) {
  const handleClick = () => {
    window.open("https://meet.google.com", "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-[0.98] ${className}`}
      title="Open Google Meet"
    >
      {/* Google Meet icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M10 14h18v20H10z" fill="#00832D" />
        <path d="M28 18l10-8v28l-10-8z" fill="#00AC47" />
        <path d="M10 14l8 6v8l-8 6z" fill="#FFBA00" />
        <path d="M28 14v6l10-8v4z" fill="#0066DA" />
        <path d="M28 34v-6l10 8v-4z" fill="#EA4335" />
        <path d="M10 14h8v6h10v-6h-10z" fill="#00832D" opacity="0.2" />
      </svg>
      Google Meet
    </button>
  );
}
