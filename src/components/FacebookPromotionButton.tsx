interface FacebookPromotionButtonProps {
  className?: string;
}

export default function FacebookPromotionButton({ className = "" }: FacebookPromotionButtonProps) {
  const handleClick = () => {
    window.open("https://www.facebook.com/business", "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-[0.98] ${className}`}
      title="Promote event on Facebook"
    >
      {/* Facebook icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M24 2C12.95 2 4 10.95 4 22c0 9.25 6.82 16.95 15.71 18.5V31.13h-4.63V24h4.63v-3.65c0-4.63 2.75-7.18 6.96-7.18 2.02 0 4.13.36 4.13.36v4.54h-2.32c-2.29 0-3 1.42-3 2.88v3.45h5.13l-.82 7.13h-4.31v11.37C37.18 38.95 44 31.25 44 22c0-11.05-8.95-20-20-20z" fill="#1877F2" />
      </svg>
      Facebook
    </button>
  );
}
