// src/pages/AttendeeProfilePage.tsx
import React, { useMemo, useState } from "react";
import { Pencil } from "lucide-react";

type ProfileForm = {
  name: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl?: string;
};

type EventItem = {
  id: string;
  title: string;
  description: string;
  progress: "Completed" | "Up Coming";
  startDate?: string; // ISO string e.g., 2026-03-25T18:00:00
  endDate?: string;   // ISO string
};

const initialProfile: ProfileForm = {
  name: "Kasun Madushan",
  email: "kasun@gmail.com",
  phone: "(+94)77 1212654",
  location: "Weligama, Matara",
  avatarUrl:
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80",
};

const initialEvents: EventItem[] = [
  {
    id: "1",
    title: "Gala Night Extravaganza",
    description:
      "A glamorous evening filled with live music, exquisite dining, and dancing. Perfect for corporate gatherings or charity fundraisers",
    progress: "Completed",
    startDate: "2026-04-05T18:00:00",
    endDate: "2026-04-05T22:00:00",
  },
  {
    id: "2",
    title: "Foodie Fest",
    description:
      "A culinary festival showcasing a variety of food trucks, local restaurants, and gourmet chefs. Attendees can enjoy tastings, cooking demos, and food-related workshops.",
    progress: "Up Coming",
    startDate: "2026-05-10T12:00:00",
    endDate: "2026-05-10T18:00:00",
  },
];

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

// Convert ISO date to Google Calendar format: YYYYMMDDTHHmmssZ
function formatDateForGoogleCal(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toISOString().replace(/-|:|\.\d+/g, "");
}

export default function AttendeeProfilePage() {
  const [form, setForm] = useState<ProfileForm>(initialProfile);
  const [events] = useState<EventItem[]>(initialEvents);

  const avatarFallback = useMemo(() => initialsFromName(form.name), [form.name]);

  function updateField<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function handleSave() {
    console.log("Saving profile:", form);
    alert("Profile saved!");
  }

  function handleEditEvent(id: string) {
    console.log("Edit event:", id);
    alert(`Edit event: ${id}`);
  }

  function handleCreateEvent() {
    console.log("Create event");
    alert("Go to Create Event page");
  }

  function handleAddToGoogleCalendar(event: EventItem) {
    const start = formatDateForGoogleCal(event.startDate);
    const end = formatDateForGoogleCal(event.endDate);
    const details = encodeURIComponent(event.description);
    const title = encodeURIComponent(event.title);
    const url = `https://calendar.google.com/calendar/r/eventedit?text=${title}&dates=${start}/${end}&details=${details}`;
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-10">
        {/* Left: Profile Card */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
            <div className="relative">
              {form.avatarUrl ? (
                <img
                  src={form.avatarUrl}
                  alt="avatar"
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                  {avatarFallback}
                </div>
              )}

              <button
                type="button"
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                onClick={() => alert("Avatar edit (optional)")}
                aria-label="Edit avatar"
              >
                <Pencil size={12} />
              </button>
            </div>

            <div className="leading-tight">
              <div className="font-semibold text-gray-900">{form.name}</div>
              <div className="text-sm text-gray-500">{form.email}</div>
            </div>
          </div>

          {/* Form rows */}
          <div className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-center">
              <div className="text-gray-700">Name</div>
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#0D5D6A]/30"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-center">
              <div className="text-gray-700">Email account</div>
              <input
                type="email"
                className="w-full rounded-md border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#0D5D6A]/30"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-center">
              <div className="text-gray-700">Mobile number</div>
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#0D5D6A]/30"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-2 sm:gap-4 items-center">
              <div className="text-gray-700">Location</div>
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#0D5D6A]/30"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center justify-center rounded-md bg-[#2F6BFF] px-6 py-2 text-white font-medium shadow-sm hover:opacity-95 active:opacity-90"
              >
                Save Change
              </button>
            </div>
          </div>
        </div>

        {/* Right: Events Card */}
        <div className="w-full lg:w-[430px] bg-white rounded-xl shadow-lg p-8">
          <div className="text-center font-semibold text-gray-900 mb-6">
            Your Events
          </div>

          <div className="space-y-4">
            {events.map((ev) => (
              <div key={ev.id} className="relative rounded-lg bg-gray-200/80 p-4">
                <button
                  type="button"
                  className="absolute top-3 right-3 text-gray-700 hover:text-gray-900"
                  onClick={() => handleEditEvent(ev.id)}
                  aria-label={`Edit ${ev.title}`}
                >
                  <Pencil size={16} />
                </button>

                <div className="font-semibold text-gray-900 mb-2">{ev.title}</div>
                <div className="text-sm text-gray-700 leading-relaxed">{ev.description}</div>

                <div className="text-sm mt-3">
                  <span className="text-gray-700">Progress : </span>
                  <span
                    className={
                      ev.progress === "Completed"
                        ? "text-green-700 font-medium"
                        : "text-green-700 font-medium"
                    }
                  >
                    {ev.progress}
                  </span>
                </div>

                {/* Google Calendar Button */}
                <button
                  type="button"
                  onClick={() => handleAddToGoogleCalendar(ev)}
                  className="mt-3 inline-flex items-center justify-center rounded-md bg-[#0A66C2] px-4 py-1 text-white font-medium text-sm shadow-sm hover:opacity-95 active:opacity-90"
                >
                  Add to Google Calendar
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCreateEvent}
            className="mt-6 inline-flex items-center justify-center rounded-md bg-[#7A0B0B] px-6 py-2 text-white font-medium shadow-sm hover:opacity-95 active:opacity-90"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}