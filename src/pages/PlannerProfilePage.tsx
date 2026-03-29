import React, { useMemo, useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyEvents, getEventById } from "../shared/api/eventClient";
import GoogleCalendarButton from "../components/GoogleCalendarButton";
import GoogleMeetButton from "../components/GoogleMeetButton";
import FacebookPromotionButton from "../components/FacebookPromotionButton";
import InstagramPromotionButton from "../components/InstagramPromotionButton";
import { getMeApi, updateMeApi } from "../features/auth/api/auth.api";
import { toast } from "react-hot-toast";
import { getVendorServiceById } from "../shared/api/vendorClient";

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
  vendorsCount?: number;
  selectedVendors?: any[];
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

  // demo data
  const user = useMemo(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const initialPlanner: Planner = useMemo(
    () => ({
      name: user?.name || "Kasun Madushan",
      email: user?.email || "kasun@gmail.com",
      mobile: "(+94) 77 1212654",
      location: "Weligama, Matara",
      avatarUrl: "", // optional
    }),
    [user],
  );

  // If no avatar, Showing Vender name initials
  const getInitials = (name: string) => {
    if (!name) return "";

    const parts = name.trim().split(" ");
    const initials = parts
      .slice(0, 2)
      .map((p) => p[0])
      .join("");

    return initials.toUpperCase();
  };

  const [planner, setPlanner] = useState<Planner>(initialPlanner);
  const [draft, setDraft] = useState<Planner>(initialPlanner);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [events, setEvents] = useState<PlannerEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [activeVendorModalEvent, setActiveVendorModalEvent] = useState<PlannerEvent | null>(null);
  const [vendorDetailsList, setVendorDetailsList] = useState<any[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getMeApi();
        if (res.user) {
          const profileData = {
            name: res.user.name || "",
            email: res.user.email || "",
            mobile: res.user.phone || "",
            location: res.user.address || "",
            avatarUrl: res.user.profileImageUrl || "",
          };
          setPlanner(profileData);
          setDraft(profileData);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    async function fetchMyEvents() {
      try {
        const response = await getMyEvents();
        const fetched = Array.isArray(response)
          ? response
          : Array.isArray((response as any)?.data)
            ? (response as any).data
            : [];

        const mapped: PlannerEvent[] = fetched.map((ev: any) => ({
          id: ev._id,
          title: ev.title,
          description: ev.description || "No description provided",
          progressLabel: ev.status === "published" ? "Published" : "Draft",
          progressColor: ev.status === "published" ? "green" : "blue",
          vendorsCount: ev.selectedVendors ? ev.selectedVendors.length : 0,
          selectedVendors: ev.selectedVendors || [],
        }));
        mapped.reverse(); // newest first
        setEvents(mapped);
      } catch (err) {
        console.error("Failed to load planner events", err);
      } finally {
        setLoadingEvents(false);
      }
    }
    fetchMyEvents();
  }, []);

  const onOpenVendorModal = async (ev: PlannerEvent) => {
    if (!ev.selectedVendors || ev.selectedVendors.length === 0) return;
    setActiveVendorModalEvent(ev);
    setLoadingVendors(true);
    try {
      const details = await Promise.all(
        ev.selectedVendors.map(async (v) => {
          if (!v.serviceId) return null;
          try {
            const res = await getVendorServiceById(v.serviceId);
            return (res as any)?.data ?? res;
          } catch (err) {
            console.error("Failed to fetch vendor service", err);
            return null;
          }
        })
      );
      setVendorDetailsList(details.filter((d) => d !== null));
    } catch (err) {
      console.error("Error loading vendor details", err);
      toast.error("Failed to load vendor details");
    } finally {
      setLoadingVendors(false);
    }
  };

  const startEdit = () => {
    setDraft(planner);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(planner);
    setIsEditing(false);
  };

  const saveEdit = async () => {
    try {
      const res = await updateMeApi({
        name: draft.name,
        phone: draft.mobile,
        address: draft.location,
        profileImageUrl: draft.avatarUrl !== planner.avatarUrl ? draft.avatarUrl : undefined,
      });

      if (res.user) {
        const updatedPlanner = {
          name: res.user.name || "",
          email: res.user.email || "",
          mobile: res.user.phone || "",
          location: res.user.address || "",
          avatarUrl: res.user.profileImageUrl || "",
        };
        setPlanner(updatedPlanner);

        // Update localStorage
        const raw = localStorage.getItem("user");
        if (raw) {
          const currentUser = JSON.parse(raw);
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...currentUser,
              name: res.user.name,
              email: res.user.email,
            }),
          );
        }

        toast.success("Profile updated successfully");
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("Failed to update profile");
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDraft(p => ({ ...p, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onEditEvent = async (id: string, isPublished: boolean) => {
    try {
      setLoadingEvents(true);
      const response = await getEventById(id);
      const ev = (response as any)?.data ?? response;
      if (!ev) throw new Error("Event not found");

      let cleanDesc = ev.description || "";
      let cap = "";
      let tPrice = "";
      let eType = "Selection";

      if (cleanDesc.includes("| Capacity:")) {
        const parts = cleanDesc.split("|");
        cleanDesc = parts[0] ? parts[0].trim() : "";
        cap =
          parts
            .find((p: string) => p.includes("Capacity:"))
            ?.replace("Capacity:", "")
            .trim() || "";
        eType =
          parts
            .find((p: string) => p.includes("Type:"))
            ?.replace("Type:", "")
            .trim() || "Selection";
        tPrice =
          parts
            .find((p: string) => p.includes("Price:"))
            ?.replace("Price:", "")
            .trim() || "";
      }

      const formData = {
        title: ev.title || "",
        description: cleanDesc,
        location: ev.location || "",
        date: ev.startDateTime ? new Date(ev.startDateTime) : null,
        startTime: ev.startDateTime
          ? ev.startDateTime.split("T")[1]?.substring(0, 5)
          : "",
        endTime: ev.endDateTime
          ? ev.endDateTime.split("T")[1]?.substring(0, 5)
          : "",
        eventMode: ev.locationType === "online" ? "virtual" : "physical",
        eventType: eType,
        capacity: cap,
        ticketPrice: tPrice,
      };

      const vendorMap: Record<string, string | null> = {};
      if (ev.selectedVendors && Array.isArray(ev.selectedVendors)) {
        ev.selectedVendors.forEach((v: any) => {
          if (v.category && v.vendorId) {
            vendorMap[v.category] = v.vendorId;
          }
        });
      }

      sessionStorage.setItem("createEventForm", JSON.stringify(formData));
      sessionStorage.setItem("activeEventId", id);

      if (Object.keys(vendorMap).length > 0) {
        sessionStorage.setItem("serviceSelections", JSON.stringify(vendorMap));
      } else {
        sessionStorage.removeItem("serviceSelections");
      }

      navigate("/create-event", { state: { lockedVendors: isPublished } });
    } catch (error) {
      console.error("Failed to fetch event for edit", error);
      toast.error("Could not load full event details.");
    } finally {
      setLoadingEvents(false);
    }
  };

  const onCreate = () => {
    navigate("/create-event");
  };

  if (loadingProfile) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-slate-100">
        <div className="text-slate-500 font-medium animate-pulse">
          Loading your profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-slate-100 px-4 py-10">
      <div className="grid w-full max-w-6xl items-start gap-12 lg:grid-cols-2">
        {/* LEFT CARD - Planner Details */}
        <div className="rounded-2xl bg-white p-8 pb-0 shadow-sm">
          {/* Header row */}
          <div className="relative flex items-center justify-center pb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-14 w-14 flex items-center justify-center rounded-full bg-slate-300 text-slate-700 font-semibold text-sm overflow-hidden">
                  {(isEditing ? draft.avatarUrl : planner.avatarUrl) ? (
                    <img
                      src={isEditing ? draft.avatarUrl : planner.avatarUrl}
                      alt="Planner avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(isEditing ? draft.name : planner.name)
                  )}
                </div>

                {isEditing && (
                  <label
                    className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm cursor-pointer"
                    title="Upload new avatar"
                  >
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    <Pencil className="h-3 w-3 text-slate-600" />
                  </label>
                )}
              </div>

              <div className="text-left">
                <div className="text-sm font-semibold text-slate-900">
                  {planner.name}
                </div>
                <div className="text-xs text-slate-500">{planner.email}</div>
              </div>
            </div>

            {/* edit icon */}
            <button
              type="button"
              onClick={startEdit}
              className="absolute right-0 top-0 rounded-full p-2 text-slate-600 hover:bg-slate-100"
              title="Edit planner details"
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

          {/* Save button like screenshot */}
          <div className="pt-6">
            {!isEditing ? (
              <button
                type="button"
                className="rounded-md bg-blue-600 px-6 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                onClick={() =>
                  toast.success("Saved (demo). Use edit icon to modify.")
                }
              >
                Save Change
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  className="rounded-md bg-blue-600 px-6 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                  onClick={saveEdit}
                >
                  Save Change
                </button>
                <button
                  type="button"
                  className="rounded-md border border-slate-300 bg-white px-6 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Google Calendar & Google Meet */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 pb-8">
            <h3 className="mb-2 text-sm font-medium text-slate-900">
              Integration Tools
            </h3>
            <p className="mb-4 text-xs text-slate-600">
              Sync your events, schedule meetings, and promote on social media.
            </p>
            <div className="flex flex-wrap gap-3">
              <GoogleCalendarButton />
              <GoogleMeetButton />
              <FacebookPromotionButton />
              <InstagramPromotionButton />
            </div>
          </div>
        </div>

        {/* RIGHT CARD - Events */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="text-center font-semibold text-slate-900">
            Your Events
          </h2>

          <div className="mt-6 space-y-4">
            {loadingEvents ? (
              <div className="flex justify-center py-5">
                <p className="text-sm font-semibold text-slate-500 animate-pulse">
                  Loading your events...
                </p>
              </div>
            ) : events.length === 0 ? (
              <div className="flex justify-center py-5">
                <p className="text-sm font-semibold text-slate-500">
                  No events found. Start planning!
                </p>
              </div>
            ) : (
              events.map((ev) => (
                <div
                  key={ev.id}
                  className="relative rounded-xl bg-slate-200 px-5 py-4 text-slate-900"
                >
                  <button
                    type="button"
                    onClick={() =>
                      onEditEvent(ev.id, ev.progressLabel === "Published")
                    }
                    className="absolute right-3 top-3 rounded-full p-1.5 text-slate-700 hover:bg-slate-300"
                    title="Edit event"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <div className="text-sm font-semibold pr-8">{ev.title}</div>
                  <div className="mt-2 text-xs text-slate-800 line-clamp-2">
                    {ev.description}
                  </div>

                  <div className="mt-3 text-xs font-semibold flex items-center gap-4">
                    <div>
                      Status:{" "}
                      <span
                        className={
                          ev.progressColor === "green"
                            ? "text-emerald-700"
                            : "text-blue-700"
                        }
                      >
                        {ev.progressLabel}
                      </span>
                    </div>
                    {typeof ev.vendorsCount === "number" &&
                      ev.vendorsCount > 0 && (
                        <div className="text-slate-600 font-medium tracking-wide">
                          Vendors Hired:{" "}
                          <button
                            type="button"
                            onClick={() => onOpenVendorModal(ev)}
                            className="text-slate-900 font-bold underline hover:text-blue-600 hover:underline-offset-2 transition-all"
                          >
                            {ev.vendorsCount}
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              ))
            )}

            <button
              type="button"
              onClick={onCreate}
              className="inline-flex rounded-md bg-red-700 px-6 py-2 text-xs font-semibold text-white hover:bg-red-800"
            >
              Create
            </button>
          </div>
        </div>
      </div>

      {/* Vendor Details Popup Modal */}
      {activeVendorModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl relative max-h-[90vh] overflow-y-auto transform transition-all">
            <button
              onClick={() => setActiveVendorModalEvent(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-4 pr-10">
              Hired Vendors for <span className="text-blue-600 font-semibold">{activeVendorModalEvent.title}</span>
            </h3>

            {loadingVendors ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="animate-pulse text-sm font-semibold text-slate-500">
                  Loading vendor details...
                </p>
              </div>
            ) : vendorDetailsList.length === 0 ? (
              <div className="flex justify-center py-10 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-sm font-medium text-slate-500">
                  No detailed vendor information found.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {vendorDetailsList.map((vendor, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 shadow-sm p-5 hover:border-slate-300 hover:shadow-md transition-all">
                    <div className="font-bold text-slate-800 text-lg mb-1 flex items-center justify-between">
                      {vendor.vendorName || vendor.serviceName || "Vendor"}
                    </div>
                    {(vendor.vendorName && vendor.serviceName) && (
                      <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-3 bg-blue-100 inline-block px-2 py-1 rounded-md">
                        {vendor.serviceName}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm mt-3 pt-3 border-t border-slate-200/60">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Email</span>
                        <span className="text-slate-800 break-all">{vendor.vendorEmail || "N/A"}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Phone</span>
                        <span className="text-slate-800">{vendor.vendorPhone || "N/A"}</span>
                      </div>
                      <div className="sm:col-span-2 flex flex-col gap-1 mt-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Price</span>
                        <span className="text-slate-900 font-bold bg-green-100 w-fit px-3 py-1 rounded-md text-green-800">
                          {vendor.currency || "USD"} {vendor.price?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
