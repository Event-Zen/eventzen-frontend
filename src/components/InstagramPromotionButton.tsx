interface InstagramPromotionButtonProps {
  className?: string;
}

export default function InstagramPromotionButton({ className = "" }: InstagramPromotionButtonProps) {
  const handleClick = () => {
    window.open("https://business.instagram.com", "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-[0.98] ${className}`}
      title="Promote event on Instagram"
    >
      {/* Instagram icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M24 4c5.52 0 6.18.02 8.35.12 2.15.1 3.58.45 4.85.95 1.31.51 2.42 1.19 3.53 2.3 1.11 1.11 1.79 2.22 2.3 3.53.5 1.27.85 2.7.95 4.85.1 2.17.12 2.83.12 8.35s-.02 6.18-.12 8.35c-.1 2.15-.45 3.58-.95 4.85-.51 1.31-1.19 2.42-2.3 3.53-1.11 1.11-2.22 1.79-3.53 2.3-1.27.5-2.7.85-4.85.95-2.17.1-2.83.12-8.35.12s-6.18-.02-8.35-.12c-2.15-.1-3.58-.45-4.85-.95-1.31-.51-2.42-1.19-3.53-2.3-1.11-1.11-1.79-2.22-2.3-3.53-.5-1.27-.85-2.7-.95-4.85C4.02 30.18 4 29.52 4 24s.02-6.18.12-8.35c.1-2.15.45-3.58.95-4.85.51-1.31 1.19-2.42 2.3-3.53 1.11-1.11 2.22-1.79 3.53-2.3 1.27-.5 2.7-.85 4.85-.95 2.17-.1 2.83-.12 8.35-.12zm0 2.88c-5.47 0-6.08.02-8.2.12-1.99.09-3.07.41-3.79.68-.95.37-1.63.81-2.34 1.52-.71.71-1.15 1.39-1.52 2.34-.27.72-.59 1.8-.68 3.79-.1 2.12-.12 2.73-.12 8.2s.02 6.08.12 8.2c.09 1.99.41 3.07.68 3.79.37.95.81 1.63 1.52 2.34.71.71 1.39 1.15 2.34 1.52.72.27 1.8.59 3.79.68 2.12.1 2.73.12 8.2.12s6.08-.02 8.2-.12c1.99-.09 3.07-.41 3.79-.68.95-.37 1.63-.81 2.34-1.52.71-.71 1.15-1.39 1.52-2.34.27-.72.59-1.8.68-3.79.1-2.12.12-2.73.12-8.2s-.02-6.08-.12-8.2c-.09-1.99-.41-3.07-.68-3.79-.37-.95-.81-1.63-1.52-2.34-.71-.71-1.39-1.15-2.34-1.52-.72-.27-1.8-.59-3.79-.68-2.12-.1-2.73-.12-8.2-.12z" fill="#E4405F" />
        <circle cx="24" cy="24" r="5.87" fill="#E4405F" />
        <circle cx="35.45" cy="12.55" r="1.37" fill="#E4405F" />
      </svg>
      Instagram
    </button>
  );
}
