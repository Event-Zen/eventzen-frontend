import React, { useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaVideo } from "react-icons/fa";

type Planner = {
    name: string;
    email: string;
    mobile: string;
    location: string;
    avatarUrl?: string;
};

type PlannerEvent = {
    id: string;
    title: string;
    description: string;
    progressLabel: string;
    progressColor: "green" | "blue";
};

function FieldRow({
    label,
    value,
    isEditing,
    onChange,
    type = "text",
}: {
    label: string;
    value: string;
    isEditing: boolean;
    onChange: (v: string) => void;
    type?: React.HTMLInputTypeAttribute;
}) {
    return (
        <div className="grid grid-cols-2 items-center gap-6 border-b border-slate-100 py-5">
            <div className="text-sm text-slate-600">{label}</div>

            <div className="text-right">
                {!isEditing ? (
                    <span className="text-sm text-slate-800">{value || "—"}</span>
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full max-w-[280px] rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />
                )}
            </div>
        </div>
    );
}

export default function PlannerProfilePage() {
    const navigate = useNavigate();

    const initialPlanner: Planner = useMemo(
        () => ({
            name: "Kasun Madushan",
            email: "kasun@gmail.com",
            mobile: "(+94) 77 1212654",
            location: "Weligama, Matara",
            avatarUrl: "",
        }),
        []
    );

    const [planner, setPlanner] = useState<Planner>(initialPlanner);
    const [draft, setDraft] = useState<Planner>(initialPlanner);
    const [isEditing, setIsEditing] = useState(false);

    const [events] = useState<PlannerEvent[]>([
        {
            id: "e1",
            title: "Gala Night Extravaganza",
            description:
                "A glamorous evening filled with live music, exquisite dining, and dancing.",
            progressLabel: "Completed",
            progressColor: "green",
        },
        {
            id: "e2",
            title: "Foodie Fest",
            description:
                "A culinary festival showcasing a variety of food trucks and chefs.",
            progressLabel: "Up Coming",
            progressColor: "blue",
        },
    ]);

    const startEdit = () => {
        setDraft(planner);
        setIsEditing(true);
    };

    const cancelEdit = () => {
        setDraft(planner);
        setIsEditing(false);
    };

    const saveEdit = () => {
        setPlanner(draft);
        setIsEditing(false);
    };

    const onEditEvent = (id: string) => {
        alert(`Edit event (demo): ${id}`);
    };

    const onCreate = () => {
        navigate("/create-event");
    };

    // ✅ GOOGLE CALENDAR
    const openGoogleCalendar = (ev: PlannerEvent) => {
        const formatDate = (date: Date) =>
            date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

        const start = new Date();
        const end = new Date(Date.now() + 60 * 60 * 1000);

        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE
        &text=${encodeURIComponent(ev.title)}
        &dates=${formatDate(start)}/${formatDate(end)}
        &details=${encodeURIComponent(ev.description)}
        &location=Online`;

        window.open(url, "_blank");
    };

    // ✅ GOOGLE MEET
    const openGoogleMeet = () => {
        window.open("https://meet.google.com", "_blank");
    };

    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-slate-100 px-4 py-10">
            <div className="grid w-full max-w-6xl gap-12 lg:grid-cols-2">

                {/* LEFT CARD */}
                <div className="rounded-2xl bg-white p-8 shadow-sm">
                    <div className="relative flex items-center justify-center pb-6">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 overflow-hidden rounded-full bg-slate-200">
                                {planner.avatarUrl && (
                                    <img
                                        src={planner.avatarUrl}
                                        alt="Planner avatar"
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </div>

                            <div className="text-left">
                                <div className="text-sm font-semibold text-slate-900">
                                    {planner.name}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {planner.email}
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={startEdit}
                            className="absolute right-0 top-0 rounded-full p-2 text-slate-600 hover:bg-slate-100"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="border-t border-slate-100">
                        <FieldRow
                            label="Name"
                            value={isEditing ? draft.name : planner.name}
                            isEditing={isEditing}
                            onChange={(v) => setDraft((p) => ({ ...p, name: v }))}
                        />
                        <FieldRow
                            label="Email account"
                            value={isEditing ? draft.email : planner.email}
                            isEditing={isEditing}
                            type="email"
                            onChange={(v) => setDraft((p) => ({ ...p, email: v }))}
                        />
                        <FieldRow
                            label="Mobile number"
                            value={isEditing ? draft.mobile : planner.mobile}
                            isEditing={isEditing}
                            onChange={(v) => setDraft((p) => ({ ...p, mobile: v }))}
                        />
                        <FieldRow
                            label="Location"
                            value={isEditing ? draft.location : planner.location}
                            isEditing={isEditing}
                            onChange={(v) => setDraft((p) => ({ ...p, location: v }))}
                        />
                    </div>

                    <div className="pt-6">
                        {!isEditing ? (
                            <button
                                type="button"
                                className="rounded-md bg-blue-600 px-6 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                            >
                                Save Change
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={saveEdit}
                                    className="rounded-md bg-blue-600 px-6 py-2 text-xs text-white"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="border px-6 py-2 text-xs"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT CARD */}
                <div className="rounded-2xl bg-white p-8 shadow-sm">
                    <h2 className="text-center font-semibold text-slate-900">
                        Your Events
                    </h2>

                    <div className="mt-6 space-y-4">
                        {events.map((ev) => (
                            <div
                                key={ev.id}
                                className="relative rounded-xl bg-slate-200 px-5 py-4"
                            >
                                <button
                                    onClick={() => onEditEvent(ev.id)}
                                    className="absolute right-3 top-3"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>

                                <div className="font-semibold">{ev.title}</div>
                                <div className="text-xs mt-2">{ev.description}</div>

                                <div className="mt-3 text-xs">
                                    Progress: {ev.progressLabel}
                                </div>

                                {/* ✅ BUTTONS */}
                                <div className="mt-3 flex gap-2">
                                    <button
                                        onClick={() => openGoogleCalendar(ev)}
                                        className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md text-xs"
                                    >
                                        <FaCalendarAlt />
                                        Calendar
                                    </button>

                                    <button
                                        onClick={openGoogleMeet}
                                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md text-xs"
                                    >
                                        <FaVideo />
                                        Meet
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={onCreate}
                            className="bg-red-700 text-white px-6 py-2 rounded-md text-xs"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}