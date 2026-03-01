import { ArrowRight } from "lucide-react";

type Service = {
    title: string;
    description: string;
    icon: string; // image path
};

const services: Service[] = [
    {
        title: "Budget Planning Support",
        description:
            "We offer comprehensive budget planning tools to help you manage expenses efficiently and stay within your financial limits.",
        icon: "/images/budget.jpg",
    },
    {
        title: "AI Support For Event Planning",
        description:
            "Our advanced AI tools assist planners in organizing seamless events by providing intelligent recommendations and automating routine tasks.",
        icon: "/images/ai.jpg",
    },
    {
        title: "Virtual Event Support",
        description:
            "Our platform enables you to host engaging virtual events with features for live streaming, interactive sessions, and attendee management.",
        icon: "/images/virtual.jpg",
    },
];

/** Gradient outline wrapper (fading blue border) */
const GradientCard = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-blue-400/70 via-blue-200/25 to-transparent shadow-[0_18px_45px_rgba(37,99,235,0.12)]">
            <div className="rounded-2xl bg-white/95 backdrop-blur px-6 py-6">
                {children}
            </div>
        </div>
    );
};

const ServiceCard = ({ title, description, icon }: Service) => {
    return (
        <GradientCard>
            <div className="flex flex-col items-center text-center">
                <img src={icon} alt={title} className="h-16 w-16 object-contain" />
                <h3 className="mt-4 text-sm font-semibold text-gray-900">{title}</h3>
                <p className="mt-3 text-xs leading-5 text-gray-500 max-w-[260px]">
                    {description}
                </p>
                <button className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-700">
                    Learn more <ArrowRight size={14} />
                </button>
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
                <div className={`absolute inset-0 w-20 h-20 border-2 ${colorClass} rounded-sm`} />
                <div
                    className={`absolute inset-0 translate-x-4 translate-y-4 w-20 h-20 border-2 ${colorClass} rounded-sm opacity-70`}
                />
            </div>
        </div>
    );
};

const ServicesOrbitSection = () => {
    return (
        <section className="relative bg-white overflow-hidden">

            {/* Decorative squares - all 4 corners */}
            <CornerSquares position="top-10 left-10" colorClass="border-blue-400" />
            <CornerSquares position="top-10 right-10" colorClass="border-blue-400" />
            <CornerSquares position="bottom-10 left-10" colorClass="border-orange-400" />
            <CornerSquares position="bottom-10 right-10" colorClass="border-orange-400" />
            {/* soft background glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/10 blur-3xl" />
            </div>

            <div className="max-w-6xl mx-auto px-6">
                <div className="relative min-h-[800px] pt-24 pb-40">
                    {/* Center text */}
                    <div className="absolute left-1/2 top-1/2 w-[320px] -translate-x-1/2 -translate-y-1/2 text-center">
                        <h2 className="text-2xl md:text-3xl font-serif text-gray-900 leading-snug">
                            What we do to help <br />
                            our customers in <br />
                            EVENTZEN.
                        </h2>
                        <p className="mt-4 text-sm text-gray-500">
                            Powerful services for planners, vendors, and attendees — all in one
                            platform.
                        </p>
                    </div>

                    {/* Cards around the text (Desktop) */}
                    <div className="hidden md:block">
                        {/* Top Left */}
                        <div className="absolute left-6 top-14 w-[340px]">
                            <ServiceCard {...services[0]} />
                        </div>

                        {/* Top Right */}
                        <div className="absolute right-6 top-10 w-[340px]">
                            <ServiceCard {...services[1]} />
                        </div>

                        {/* Bottom Center */}
                        <div className="absolute left-1/2 bottom-12 w-[360px] -translate-x-1/2 translate-y-8">
                            <ServiceCard {...services[2]} />
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

                        <ServiceCard {...services[0]} />
                        <ServiceCard {...services[1]} />
                        <ServiceCard {...services[2]} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesOrbitSection;