import React, { useMemo, useState } from "react";
import { ArrowRight, ChevronUp } from "lucide-react";

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string; // image path
  moreTitle: string;
  bullets: string[];
  extraNote: string;
};

const services: Service[] = [
  {
    id: "budget",
    title: "Budget Planning Support",
    description:
      "We offer comprehensive budget planning tools to help you manage expenses efficiently and stay within your financial limits.",
    icon: "/images/budget.jpg",
    moreTitle: "What you get",
    bullets: [
      "Vendor-wise cost breakdown and summaries",
      "Auto budget recalculation when vendors/services change",
    //   "Exportable budget report for approvals",
    ],
    extraNote:
      "Tip: Set a maximum budget and we’ll alert you before you exceed it.",
  },
  {
    id: "ai",
    title: "AI Support For Event Planning",
    description:
      "Our advanced AI tools assist planners in organizing seamless events by providing intelligent recommendations and automating routine tasks.",
    icon: "/images/ai.jpg",
    moreTitle: "AI features",
    bullets: [
      "Smart vendor suggestions based on event type and location",
    //   "Agenda and timeline generation in seconds",
      "Answers from past events (chatbot + analytics)",
    ],
    extraNote: "AI suggestions improve as you add more event details.",
  },
  {
    id: "virtual",
    title: "Virtual Event Support",
    description:
      "Our platform enables you to host engaging virtual events with features for live streaming, interactive sessions, and attendee management.",
    icon: "/images/virtual.jpg",
    moreTitle: "Virtual event tools",
    bullets: [
      "Session links + calendar invites",
      "Attendee check-in and engagement tracking",
      "Reminders and follow-ups via email",
    ],
    extraNote: "Works great for hybrid events too (on-site + online).",
  },
];

/** Gradient outline wrapper (fading blue border) */
const GradientCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-br from-blue-400/70 via-blue-200/25 to-transparent shadow-[0_18px_45px_rgba(37,99,235,0.12)] my-5">
      <div className="rounded-2xl bg-white/95 backdrop-blur px-6 py-6">
        {children}
      </div>
    </div>
  );
};

const ServiceCard = ({
  service,
  isExpanded,
  onToggle,
}: {
  service: Service;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const contentId = useMemo(() => `service-more-${service.id}`, [service.id]);

  return (
    <GradientCard>
      <div className="flex flex-col items-center text-center">
        <img
          src={service.icon}
          alt={service.title}
          className="h-16 w-16 object-contain"
        />

        <h3 className="mt-4 text-sm font-semibold text-gray-900">
          {service.title}
        </h3>

        <p className="mt-3 text-xs leading-5 text-gray-500 max-w-[260px]">
          {service.description}
        </p>

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-controls={contentId}
          className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          {isExpanded ? (
            <>
              Show less <ChevronUp size={14} />
            </>
          ) : (
            <>
              Learn more <ArrowRight size={14} />
            </>
          )}
        </button>

        <div
          id={contentId}
          className={`w-full overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-in-out
                ${isExpanded ? "max-h-[420px] opacity-100 mt-5" : "max-h-0 opacity-0 mt-0"}
            `}
        >
          <div className="w-full rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-4 text-left">
            <div className="text-xs font-semibold text-gray-900">
              {service.moreTitle}
            </div>

            <ul className="mt-3 space-y-2 text-xs text-gray-600">
              {service.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="leading-5">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 text-[11px] text-gray-500 leading-5">
              {service.extraNote}
            </div>
          </div>
        </div>
      </div>
    </GradientCard>
  );
};

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

const ServicesOrbitSection = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Decorative squares - all 4 corners */}
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
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/10 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="hidden md:grid grid-cols-2 gap-10 items-start">
          <div className="w-[340px] justify-self-start">
            <ServiceCard
              service={services[0]}
              isExpanded={expandedId === services[0].id}
              onToggle={() => toggle(services[0].id)}
            />
          </div>

          <div className="w-[340px] justify-self-end">
            <ServiceCard
              service={services[1]}
              isExpanded={expandedId === services[1].id}
              onToggle={() => toggle(services[1].id)}
            />
          </div>

          {/* Row 2: center text spans 2 cols */}
          <div className="col-span-2 flex justify-center">
            <div className="w-[320px] text-center">
              <h2 className="text-2xl md:text-3xl font-serif text-gray-900 leading-snug">
                What we do to help <br />
                our customers in <br />
                EVENTZEN.
              </h2>
              <p className="mt-4 text-sm text-gray-500">
                Powerful services for planners, vendors, and attendees — all in
                one platform.
              </p>
            </div>
          </div>

          {/* Row 3: bottom center card spans 2 cols */}
          <div className="col-span-2 flex justify-center">
            <div className="w-[360px]">
              <ServiceCard
                service={services[2]}
                isExpanded={expandedId === services[2].id}
                onToggle={() => toggle(services[2].id)}
              />
            </div>
          </div>
        </div>

        {/* Mobile layout (stacked) */}
        <div className="md:hidden space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-serif text-gray-900 leading-snug">
              What we do to help <br />
              our customers in <br />
              EVENTZEN.
            </h2>
            <p className="mt-4 text-sm text-gray-500">
              Powerful services for planners, vendors, and attendees.
            </p>
          </div>

          {services.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              isExpanded={expandedId === s.id}
              onToggle={() => toggle(s.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOrbitSection;