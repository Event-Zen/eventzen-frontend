import { useMemo, useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import GoogleCalendarButton from "../components/GoogleCalendarButton";
import { getMeApi, updateMeApi } from "../features/auth/api/auth.api";
import { toast } from "react-hot-toast";
import { useAuthUser } from "../features/auth/hooks/useAuthUser";
import { getEventById } from "../shared/api/eventClient";

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
};

const initialProfile: ProfileForm = {
  name: "Kasun Madushan",
  email: "kasun@gmail.com",
  phone: "(+94)77 1212654",
  location: "Weligama, Matara",
  avatarUrl: "",
};

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

export default function AttendeeProfilePage() {
  const { user } = useAuthUser();
  const [form, setForm] = useState<ProfileForm>(() => {
    const raw = localStorage.getItem("user");
    let u: any = {};
    if (raw) {
      try {
        u = JSON.parse(raw);
      } catch { }
    }
    return {
      ...initialProfile,
      name: u.name || initialProfile.name,
      email: u.email || initialProfile.email,
    };
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getMeApi();
        if (res.user) {
          setForm({
            name: res.user.name || "",
            email: res.user.email || "",
            phone: res.user.phone || "",
            location: res.user.address || "",
            avatarUrl: res.user.profileImageUrl || initialProfile.avatarUrl,
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, []);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    async function fetchPurchasedEvents() {
      if (!user?.id) {
        setLoadingEvents(false);
        return;
      }
      try {
        setLoadingEvents(true);
        // fetch payments
        const res = await fetch(`http://localhost:3003/api/payments/user/${user.id}`);
        const data = await res.json();
        const eventIds: string[] = data.data || [];
        
        // fetch event details
        const fetchedEvents = await Promise.all(
          eventIds.map(async (id) => {
            try {
              const evRes = await getEventById(id);
              return evRes.data || evRes;
            } catch (err) {
              console.error(`Failed to fetch event ${id}`, err);
              return null;
            }
          })
        );
        
        const validEvents = fetchedEvents.filter(Boolean);
        const now = new Date();
        
        const mapped: EventItem[] = validEvents.map((ev: any) => {
          const endDateTime = new Date(ev.endDateTime);
          const isCompleted = endDateTime < now;
          return {
            id: ev._id || ev.id,
            title: ev.title || "Untitled Event",
            description: ev.description || "No description provided.",
            progress: isCompleted ? "Completed" : "Up Coming",
          };
        });
        
        setEvents(mapped);
      } catch (err) {
        console.error("Failed to fetch attendee events", err);
      } finally {
        setLoadingEvents(false);
      }
    }
    fetchPurchasedEvents();
  }, [user?.id]);

  const avatarFallback = useMemo(() => initialsFromName(form.name), [form.name]);

  function updateField<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function handleSave() {
    try {
      const res = await updateMeApi({
        name: form.name,
        phone: form.phone,
        address: form.location,
        profileImageUrl: form.avatarUrl,
      });

      if (res.user) {
        setForm({
          name: res.user.name || "",
          email: res.user.email || "",
          phone: res.user.phone || "",
          location: res.user.address || "",
          avatarUrl: res.user.profileImageUrl || form.avatarUrl,
        });

        // Update localStorage
        const raw = localStorage.getItem("user");
        if (raw) {
          const currentUser = JSON.parse(raw);
          localStorage.setItem("user", JSON.stringify({
            ...currentUser,
            name: res.user.name,
            email: res.user.email
          }));
        }

        toast.success("Profile saved!");
      }
    } catch (err) {
      console.error("Failed to save profile", err);
      toast.error("Failed to save profile");
    }
  }



  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField("avatarUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };



  if (loadingProfile) {
    return (
      <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center">
        <div className="text-slate-500 font-medium animate-pulse">Loading profile...</div>
      </div>
    );
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

              {/* small edit icon circle */}
              <div
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm cursor-pointer hover:bg-gray-50 overflow-hidden"
                aria-label="Edit avatar"
              >
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" accept="image/*" onChange={handleAvatarChange} />
                <Pencil size={12} className="text-gray-600 pointer-events-none" />
              </div>
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

            {/* Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center justify-center rounded-md bg-[#2F6BFF] px-6 py-2 text-white font-medium shadow-sm hover:opacity-95 active:opacity-90"
              >
                Save Change
              </button>
            </div>

            {/* Reminders & Calendar */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Reminders & Calendar</h3>
              <p className="text-xs text-gray-600 mb-3">
                Open Google Calendar to add reminders for your upcoming events.
              </p>
              <GoogleCalendarButton />
            </div>
          </div>
        </div>

        {/* Right: Events Card */}
        <div className="w-full lg:w-[430px] bg-white rounded-xl shadow-lg p-8">
          <div className="text-center font-semibold text-gray-900 mb-6">
            Your Events
          </div>

          <div className="space-y-4">
            {loadingEvents ? (
              <div className="text-gray-500 font-medium animate-pulse text-center">Loading your events...</div>
            ) : events.length === 0 ? (
              <div className="text-gray-500 text-center py-4">You haven't purchased any events yet.</div>
            ) : events.map((ev) => (
              <div
                key={ev.id}
                className="relative rounded-lg bg-gray-200/80 p-4"
              >


                <div className="font-semibold text-gray-900 mb-2">
                  {ev.title}
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  {ev.description}
                </div>

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
              </div>
            ))}
          </div>


        </div>
      </div>
    </div>
  );
}