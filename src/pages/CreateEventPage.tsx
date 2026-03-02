import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type EventType = "physical" | "virtual";

type FormState = {
    title: string;
    description: string;
    location: string;
    date: Date | null;
    time: string; // "HH:MM"
    eventMode: EventType;
    eventType: string;
    capacity: string;
    ticketPrice: string;
};

const EVENT_TYPES = ["Selection", "Conference", "Workshop", "Meetup", "Concert", "Webinar"];

function pad2(n: number) {
    return String(n).padStart(2, "0");
}

function toYMD(d: Date) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function sameDay(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function buildCalendarDays(viewYear: number, viewMonth: number) {
    // viewMonth: 0-11
    const first = new Date(viewYear, viewMonth, 1);
    const last = new Date(viewYear, viewMonth + 1, 0);
    const startWeekday = first.getDay(); // 0 Sun .. 6 Sat

    const days: Array<{ date: Date; inMonth: boolean }> = [];

    // previous month tail
    for (let i = 0; i < startWeekday; i++) {
        const d = new Date(viewYear, viewMonth, 1 - (startWeekday - i));
        days.push({ date: d, inMonth: false });
    }

    // current month
    for (let day = 1; day <= last.getDate(); day++) {
        days.push({ date: new Date(viewYear, viewMonth, day), inMonth: true });
    }

    // next month head to make full weeks (multiple of 7)
    while (days.length % 7 !== 0) {
        const d = new Date(viewYear, viewMonth, last.getDate() + (days.length - (startWeekday + last.getDate())) + 1);
        days.push({ date: d, inMonth: false });
    }

    return days;
}

function InlineCalendar({
    value,
    onChange,
}: {
    value: Date | null;
    onChange: (d: Date) => void;
}) {
    const today = new Date();
    const initial = value ?? today;

    const [viewYear, setViewYear] = useState(initial.getFullYear());
    const [viewMonth, setViewMonth] = useState(initial.getMonth());

    const monthName = useMemo(() => {
        return new Date(viewYear, viewMonth, 1).toLocaleString(undefined, { month: "long" });
    }, [viewYear, viewMonth]);

    const days = useMemo(() => buildCalendarDays(viewYear, viewMonth), [viewYear, viewMonth]);

    const goPrev = () => {
        const d = new Date(viewYear, viewMonth - 1, 1);
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
    };

    const goNext = () => {
        const d = new Date(viewYear, viewMonth + 1, 1);
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
    };

    return (
        <div className="w-full">
            <div className="mb-2 flex items-center justify-between">
                <button
                    type="button"
                    onClick={goPrev}
                    className="rounded border px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                    aria-label="Previous month"
                >
                    ‹
                </button>
                <div className="text-xs font-medium text-slate-700">
                    {monthName} {viewYear}
                </div>
                <button
                    type="button"
                    onClick={goNext}
                    className="rounded border px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                    aria-label="Next month"
                >
                    ›
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-[10px] text-slate-500">
                {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <div key={d} className="text-center">
                        {d}
                    </div>
                ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-1">
                {days.map(({ date, inMonth }) => {
                    const isSelected = value ? sameDay(date, value) : false;
                    const isToday = sameDay(date, today);

                    return (
                        <button
                            key={date.toISOString()}
                            type="button"
                            onClick={() => onChange(date)}
                            className={[
                                "h-6 rounded text-xs",
                                inMonth ? "text-slate-700" : "text-slate-400",
                                isSelected ? "bg-blue-600 text-white" : "hover:bg-slate-100",
                                !isSelected && isToday ? "ring-1 ring-slate-300" : "",
                            ].join(" ")}
                            title={toYMD(date)}
                        >
                            {date.getDate()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function CreateEventPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState<FormState>({
        title: "",
        description: "",
        location: "",
        date: null,
        time: "",
        eventMode: "physical",
        eventType: "Selection",
        capacity: "",
        ticketPrice: "",
    });

    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((p) => ({ ...p, [key]: value }));
    };

    const onCancel = () => {
        navigate("/");
    };

    const onNext = (e: React.FormEvent) => {
        e.preventDefault();

        // Demo: replace with your real flow (stepper / API)
        const payload = {
            ...form,
            date: form.date ? toYMD(form.date) : null,
        };
        console.log("Next payload:", payload);
        alert("Next (demo). You can route to step-2 or submit to backend.");
    };

    return (
        <div className="relative min-h-[calc(100vh-0px)] bg-white">
            {/* Big whitespace like your design */}
            <div className="mx-auto max-w-6xl px-6 py-10">
                <div className="flex lg:gap-75">
                    {/* Left column form */}
                    <div className="w-full max-w-sm">
                        <h1 className="mb-6 text-2xl font-semibold text-slate-900">Create Event</h1>

                        <form onSubmit={onNext} className="space-y-4">
                            {/* Event Title */}
                            <div>
                                <label className="block text-xs text-slate-700">Event Title</label>
                                <input
                                    value={form.title}
                                    onChange={(e) => setField("title", e.target.value)}
                                    className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs text-slate-700">Description</label>
                                <input
                                    value={form.description}
                                    onChange={(e) => setField("description", e.target.value)}
                                    className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-xs text-slate-700">Location</label>
                                <input
                                    value={form.location}
                                    onChange={(e) => setField("location", e.target.value)}
                                    className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-xs text-slate-700">Date</label>
                                <div className="mt-2">
                                    <InlineCalendar
                                        value={form.date}
                                        onChange={(d) => setField("date", d)}
                                    />
                                </div>
                            </div>

                            {/* Time */}
                            <div>
                                <label className="block text-xs text-slate-700">Time</label>
                                <input
                                    type="time"
                                    value={form.time}
                                    onChange={(e) => setField("time", e.target.value)}
                                    className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                                />
                            </div>

                            {/* Physical / Virtual */}
                            <div className="flex items-center gap-6 pt-1">
                                <label className="flex items-center gap-2 text-xs text-slate-700">
                                    <input
                                        type="radio"
                                        name="eventMode"
                                        checked={form.eventMode === "physical"}
                                        onChange={() => setField("eventMode", "physical")}
                                    />
                                    Physical Event
                                </label>

                                <label className="flex items-center gap-2 text-xs text-slate-700">
                                    <input
                                        type="radio"
                                        name="eventMode"
                                        checked={form.eventMode === "virtual"}
                                        onChange={() => setField("eventMode", "virtual")}
                                    />
                                    Virtual Event
                                </label>
                            </div>

                            {/* Event Type */}
                            <div>
                                <label className="block text-xs text-slate-700">Event Type</label>
                                <select
                                    value={form.eventType}
                                    onChange={(e) => setField("eventType", e.target.value)}
                                    className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                                >
                                    {EVENT_TYPES.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Attendee Capacity */}
                            <div>
                                <label className="block text-xs text-slate-700">Attendee Capacity</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={form.capacity}
                                    onChange={(e) => setField("capacity", e.target.value)}
                                    className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                                />
                            </div>

                            {/* Ticket Price */}
                            <div>
                                <label className="block text-xs text-slate-700">Ticket Price</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={form.ticketPrice}
                                    onChange={(e) => setField("ticketPrice", e.target.value)}
                                    className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                                />
                            </div>

                            {/* Bottom buttons like screenshot */}
                            <div className="pt-6">
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={onCancel}
                                        className="rounded bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="rounded bg-blue-600 px-6 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>


                    

                    {/* Right side for smart insights */}
                    <div className="hidden lg:block lg:w-[420px] pl-10">
                        <div className="sticky top-24 space-y-6">

                            {/* Smart Insights Card */}
                            <div className="rounded-2xl border bg-white shadow-sm p-6">
                                <h3 className="text-lg text-center font-semibold text-slate-900 mb-4">
                                    Smart Insights
                                </h3>

                                <div className="space-y-4 text-sm text-slate-700">

                                    {/* Estimated Revenue */}
                                    <div className="flex justify-between">
                                        <span>Estimated Revenue</span>
                                        <span className="font-semibold text-slate-900">
                                            {form.capacity && form.ticketPrice
                                                ? `LKR ${Number(form.capacity) * Number(form.ticketPrice)}`
                                                : "—"}
                                        </span>
                                    </div>

                                    {/* Event Duration */}
                                    <div className="flex justify-between">
                                        <span>Event Duration</span>
                                        <span className="font-semibold text-slate-900">
                                            {form.time ? "Custom Time Set" : "Not Set"}
                                        </span>
                                    </div>

                                    {/* Ticket Type */}
                                    <div className="flex justify-between">
                                        <span>Ticket Type</span>
                                        <span className="font-semibold text-slate-900">
                                            {form.ticketPrice && Number(form.ticketPrice) > 0
                                                ? "Paid Event"
                                                : "Free Event"}
                                        </span>
                                    </div>

                                    {/* Mode */}
                                    <div className="flex justify-between">
                                        <span>Event Mode</span>
                                        <span className="font-semibold text-slate-900 capitalize">
                                            {form.eventMode}
                                        </span>
                                    </div>

                                    {/* Capacity Check */}
                                    <div className="flex justify-between">
                                        <span>Capacity Status</span>
                                        <span
                                            className={`font-semibold ${form.capacity && Number(form.capacity) > 500
                                                    ? "text-red-600"
                                                    : "text-green-600"
                                                }`}
                                        >
                                            {form.capacity
                                                ? Number(form.capacity) > 500
                                                    ? "Large Scale Event"
                                                    : "Standard Event"
                                                : "Not Set"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* AI Suggestion Box */}
                            <div className="rounded-2xl border bg-violet-50 p-6">
                                <h4 className="text-sm text-center font-semibold text-violet-900 mb-3">
                                    AI Suggestion
                                </h4>

                                <p className="text-xs text-violet-800 leading-relaxed">
                                    {form.ticketPrice && Number(form.ticketPrice) > 0
                                        ? "Consider offering early bird discounts to increase initial registrations."
                                        : "Free events usually attract higher engagement. You may monetize via sponsors."}
                                </p>

                                {form.eventMode === "virtual" && (
                                    <p className="mt-3 text-xs text-violet-800">
                                        Virtual events perform best between 6PM - 9PM.
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Floating AI Support pill (bottom center) */}
            <button
                type="button"
                className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-violet-700 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-violet-800"
                onClick={() => alert("AI Support (demo)")}
            >
                ✦ AI Support
            </button>
        </div>
    );
}