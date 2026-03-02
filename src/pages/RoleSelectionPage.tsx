import React from "react";
import { useNavigate } from "react-router-dom";

type Role = "Attendee" | "Service Provider" | "Organizer";

type Props = {
  onSelectRole?: (role: Role) => void;
  onLogin?: () => void;
};

export default function RoleSelectionPage({ onSelectRole, onLogin }: Props) {
  const navigate = useNavigate();

  const handleSelect = (role: Role) => {
    if (onSelectRole) return onSelectRole(role);

    switch (role) {
      case "Attendee":
        return navigate("/register/attendee");
      case "Service Provider":
        return navigate("/register/vendor");
      case "Organizer":
        return navigate("/register/organizer");
      default:
        return;
    }
  };

  const handleLogin = () => {
    if (onLogin) return onLogin();
    navigate("/login");
  };

  return (
    <section className="relative bg-white overflow-hidden min-h-screen">
      <CornerSquares position="top-10 left-10" colorClass="border-blue-400" />
      <CornerSquares position="top-10 right-10" colorClass="border-blue-400" />
      <CornerSquares
        position="bottom-10 left-10"
        colorClass="border-orange-400"
      />
      <CornerSquares
        position="bottom-10 right-10"
        colorClass="border-orange-400"
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/10 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-20 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-xl">
          <GradientCard>
            <h1 className="mt-6 text-center text-2xl md:text-3xl font-serif text-gray-900 leading-snug">
              Select Account
            </h1>
            <p className="mt-3 text-center text-sm text-gray-500">
              Choose your role to continue with EventZen.
            </p>

            <div className="mt-10 flex flex-col gap-4">
              <RoleButton
                label="ATTENDEE"
                onClick={() => handleSelect("Attendee")}
              />
              <RoleButton
                label="SERVICE PROVIDER"
                onClick={() => handleSelect("Service Provider")}
              />
              <RoleButton
                label="ORGANIZER"
                onClick={() => handleSelect("Organizer")}
              />
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <span className="text-sm text-gray-600 font-medium">
                Already have an account?
              </span>
              <button
                type="button"
                onClick={handleLogin}
                className="rounded-md bg-blue-600 px-7 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,0.18)] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
              >
                LOGIN
              </button>
            </div>
          </GradientCard>
        </div>
      </div>
    </section>
  );
}

const GradientCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-br from-blue-400/70 via-blue-200/25 to-transparent shadow-[0_18px_45px_rgba(37,99,235,0.12)]">
      <div className="rounded-2xl bg-white/95 backdrop-blur px-8 py-10">
        {children}
      </div>
    </div>
  );
};

function RoleButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-blue-100 bg-blue-50/50 px-6 py-4 text-center text-sm font-semibold text-gray-900
                 hover:bg-blue-100/60 hover:border-blue-200
                 shadow-[0_10px_25px_rgba(37,99,235,0.08)]
                 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
    >
      {label}
    </button>
  );
}

const CornerSquares = ({
  position,
  colorClass,
}: {
  position: string;
  colorClass: string;
}) => {
  return (
    <div className={`absolute ${position} hidden md:block`}>
      <div className="relative w-20 h-20">
        <div
          className={`absolute inset-0 w-20 h-20 border-2 ${colorClass} rounded-sm`}
        />
        <div
          className={`absolute inset-0 translate-x-4 translate-y-4 w-20 h-20 border-2 ${colorClass} rounded-sm opacity-70`}
        />
      </div>
    </div>
  );
};
