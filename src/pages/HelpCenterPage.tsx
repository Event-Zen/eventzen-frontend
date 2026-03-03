import React, { useMemo, useState } from "react";

type TabKey = "general" | "attendee" | "vendor" | "organizer";

type HelpSection = {
    title: string;
    items?: string[];
    lines?: string[]; // for small paragraph-like lines
};

type HelpContent = {
    heading: string;
    sections: HelpSection[];
};

export default function HelpCenterPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("general");

    const contentByTab: Record<TabKey, HelpContent> = useMemo(
        () => ({
            general: {
                heading: "🔐 GENERAL HELP",
                sections: [
                    {
                        title: "Account & Security",
                        items: [
                            "Password reset option available",
                            "Email verification required",
                            "Secure authentication implemented",
                        ],
                    },
                    {
                        title: "Google Calendar Integration",
                        lines: ["Users can:"],
                        items: ["Add events to Google Calendar", "Receive reminders automatically"],
                    },
                    {
                        title: "Contact Support",
                        lines: [
                            "If you experience technical issues:",
                            "Email: support@eventzen.lk",
                            "University Project – Faculty of Software Engineering",
                            "Response Time: Within 24–48 hours",
                        ],
                    },
                ],
            },
            attendee: {
                heading: "🎟️ ATTENDEE HELP",
                sections: [
                    {
                        title: "Finding Events",
                        items: ["Use search to find events by name or category", "Filter by date and location"],
                    },
                    {
                        title: "Booking & Tickets",
                        items: ["Select an event and follow booking steps", "Check email for ticket confirmation"],
                    },
                    {
                        title: "Cancellations",
                        items: ["Contact organizer for cancellation policy", "Refunds depend on event type and rules"],
                    },
                ],
            },
            vendor: {
                heading: "🧰 VENDOR HELP",
                sections: [
                    {
                        title: "Vendor Profile",
                        items: ["Update your details using the edit icon", "Keep contact number accurate for bookings"],
                    },
                    {
                        title: "Services",
                        items: ["Add services with clear description and price", "Edit services anytime from profile page"],
                    },
                    {
                        title: "Bookings",
                        items: ["Respond quickly to organizer requests", "Confirm availability before accepting"],
                    },
                ],
            },
            organizer: {
                heading: "📌 ORGANIZER HELP",
                sections: [
                    {
                        title: "Create Event",
                        items: [
                            "Fill event details (title, date, time, location)",
                            "Add capacity and ticket price if needed",
                            "Proceed to services selection",
                        ],
                    },
                    {
                        title: "Venue & Scheduling",
                        items: [
                            "Choose university venues from the dropdown",
                            "Avoid clashes by selecting available slots",
                        ],
                    },
                    {
                        title: "Promoting Events",
                        items: [
                            "Share event link with attendees",
                            "Use clear poster/cover image and strong description",
                        ],
                    },
                ],
            },
        }),
        []
    );

    const tabs: { key: TabKey; label: string }[] = [
        { key: "general", label: "General" },
        { key: "attendee", label: "Attendee" },
        { key: "vendor", label: "Vendor" },
        { key: "organizer", label: "Organizer" },
    ];

    const current = contentByTab[activeTab];

    return (
        <div className="relative min-h-screen bg-white overflow-hidden">
            {/* Decorative Corner Squares */}
            {/* Top Left */}
            <div className="absolute top-10 left-10 hidden md:block">
                <div className="relative h-20 w-20">
                    <div className="absolute h-20 w-20 border-2 border-blue-400 rounded-lg"></div>
                    <div className="absolute top-6 left-6 h-20 w-20 border-2 border-blue-300 rounded-lg"></div>
                </div>
            </div>

            {/* Top Right */}
            <div className="absolute top-10 right-10 hidden md:block">
                <div className="relative h-20 w-20">
                    <div className="absolute h-20 w-20 border-2 border-blue-400 rounded-lg"></div>
                    <div className="absolute top-6 left-6 h-20 w-20 border-2 border-blue-300 rounded-lg"></div>
                </div>
            </div>

            {/* Bottom Left */}
            <div className="absolute bottom-10 left-10 hidden md:block">
                <div className="relative h-20 w-20">
                    <div className="absolute h-20 w-20 border-2 border-orange-400 rounded-lg"></div>
                    <div className="absolute top-6 left-6 h-20 w-20 border-2 border-orange-300 rounded-lg"></div>
                </div>
            </div>

            {/* Bottom Right */}
            <div className="absolute bottom-10 right-10 hidden md:block">
                <div className="relative h-20 w-20">
                    <div className="absolute h-20 w-20 border-2 border-orange-400 rounded-lg"></div>
                    <div className="absolute top-6 left-6 h-20 w-20 border-2 border-orange-300 rounded-lg"></div>
                </div>
            </div>
            <div className="mx-auto max-w-6xl px-6 py-10">
                {/* Page title */}
                <h1 className="text-center text-lg font-extrabold tracking-wide text-slate-900">
                    EVENTZEN  HELP  CENTER
                </h1>

                {/* Tabs */}
                <div className="mt-8 flex justify-center">
                    <div className="inline-flex overflow-hidden rounded-t-lg border border-slate-200 bg-slate-50">
                        {tabs.map((t) => {
                            const active = t.key === activeTab;
                            return (
                                <button
                                    key={t.key}
                                    type="button"
                                    onClick={() => setActiveTab(t.key)}
                                    className={[
                                        "px-6 py-3 text-xs font-semibold transition",
                                        active
                                            ? "bg-white text-slate-900"
                                            : "bg-slate-50 text-slate-600 hover:bg-slate-100",
                                        "border-r border-slate-200 last:border-r-0",
                                    ].join(" ")}
                                >
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Center panel */}
                <div className="mt-0 flex justify-center">
                    <div className="w-full max-w-xl rounded-b-2xl rounded-t-2xl border border-slate-200 bg-[#fbf6f6] px-10 py-10 shadow-sm">
                        <div className="text-center">
                            <h2 className="text-sm font-extrabold text-slate-900">{current.heading}</h2>
                        </div>

                        <div className="mt-8 space-y-8 text-sm text-slate-800">
                            {current.sections.map((sec) => (
                                <div key={sec.title}>
                                    <h3 className="text-xs font-bold text-slate-900">{sec.title}</h3>

                                    {sec.lines?.length ? (
                                        <div className="mt-2 space-y-1 text-[11px] text-slate-700">
                                            {sec.lines.map((line) => (
                                                <p key={line}>{line}</p>
                                            ))}
                                        </div>
                                    ) : null}

                                    {sec.items?.length ? (
                                        <ul className="mt-2 list-disc space-y-1 pl-5 text-[11px] text-slate-700">
                                            {sec.items.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Extra whitespace like screenshot */}
                <div className="h-24" />
            </div>
        </div>
    );
}