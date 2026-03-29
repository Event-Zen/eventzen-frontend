import React, { useEffect, useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import GoogleCalendarButton from "../components/GoogleCalendarButton";
import { getMyVendorServices, listVendorServices } from "../shared/api/vendorClient";
import { getMeApi, updateMeApi } from "../features/auth/api/auth.api";
import { toast } from "react-hot-toast";

type Vendor = {
  name: string;
  email: string;
  mobile: string;
  location: string;
  avatarUrl?: string;
};

type VendorService = {
  id: string;
  title: string;
  description: string;
  price: string;
};

type AuthUser = {
  id?: string;
  _id?: string;
  email?: string;
  name?: string;
};

function readAuthUser(): AuthUser | null {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function extractServiceArray(res: any): any[] {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.services)) return res.services;
  if (Array.isArray(res?.items)) return res.items;
  if (Array.isArray(res?.results)) return res.results;
  if (Array.isArray(res?.rows)) return res.rows;
  if (Array.isArray(res?.data?.services)) return res.data.services;
  if (Array.isArray(res?.data?.items)) return res.data.items;
  if (Array.isArray(res?.data?.results)) return res.data.results;
  if (Array.isArray(res?.data?.rows)) return res.data.rows;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

function belongsToVendor(service: any, user: AuthUser | null) {
  if (!user) return true;

  const vendorIdCandidates = [
    service?.vendorId,
    service?.vendor?._id,
    service?.vendor?.id,
    service?.ownerId,
    service?.createdBy,
    service?.createdById,
    service?.userId,
  ]
    .filter(Boolean)
    .map((value) => String(value));

  const vendorEmailCandidates = [service?.vendorEmail, service?.vendor?.email, service?.email]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  const vendorNameCandidates = [service?.vendorName, service?.vendor?.name]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  const userIds = [user.id, user._id].filter(Boolean).map((value) => String(value));
  const userEmail = String(user.email || "").toLowerCase();
  const userName = String(user.name || "").toLowerCase();

  const idMatch = userIds.some((id) => vendorIdCandidates.includes(id));
  const emailMatch = !!userEmail && vendorEmailCandidates.includes(userEmail);
  const nameMatch = !!userName && vendorNameCandidates.includes(userName);

  return idMatch || emailMatch || nameMatch;
}

function dedupeById(items: any[]) {
  const byId = new Map<string, any>();
  items.forEach((item) => {
    const key = String(item?._id || item?.id || "");
    if (key && !byId.has(key)) {
      byId.set(key, item);
    }
  });
  return Array.from(byId.values());
}

function hasVendorIdentityFields(service: any) {
  return Boolean(
    service?.vendorId ||
    service?.vendor?._id ||
    service?.vendor?.id ||
    service?.ownerId ||
    service?.createdBy ||
    service?.createdById ||
    service?.userId ||
    service?.vendorEmail ||
    service?.vendor?.email,
  );
}

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
            className="w-full max-w-[260px] rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        )}
      </div>
    </div>
  );
}

// This dummy data should be replace from API call
export default function VendorProfilePage() {
  const user = readAuthUser();
  const initialVendor: Vendor = useMemo(
    () => ({
      name: user?.name || "Dhanuka Navod",
      email: user?.email || "dhanuka@gmail.com",
      mobile: "(+94) 77 1231234",
      location: "Dehigahalanda, Ambalantota",
      avatarUrl: "",
    }),
    [user]
  );

  const navigate = useNavigate();

  const [vendor, setVendor] = useState<Vendor>(initialVendor);
  const [draft, setDraft] = useState<Vendor>(initialVendor);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [services, setServices] = useState<VendorService[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
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
          setVendor(profileData);
          setDraft(profileData);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      const user = readAuthUser();
      let myServices: any[] = [];
      let vendorServicesRaw: any[] = [];
      let myFetchFailed = false;
      let allFetchFailed = false;

      try {
        const myRes = await getMyVendorServices();
        myServices = extractServiceArray(myRes);
        vendorServicesRaw = myServices;
      } catch (err) {
        myFetchFailed = true;
        console.error("Failed to load /me vendor services", err);
      }

      // Fallback for backends where /me returns only latest service or errors.
      if (myServices.length <= 1) {
        try {
          const allRes = await listVendorServices();
          const allServices = extractServiceArray(allRes);

          const hasIdentity = allServices.some((service: any) => hasVendorIdentityFields(service));
          const filtered = hasIdentity
            ? allServices.filter((service: any) => belongsToVendor(service, user))
            : allServices;

          if (filtered.length > 0 || myServices.length > 0) {
            vendorServicesRaw = dedupeById([...myServices, ...filtered]);
          }
        } catch (err) {
          allFetchFailed = true;
          console.error("Failed to load full vendor services list", err);
        }
      }

      try {
        const formatted = vendorServicesRaw.map((s: any) => ({
          id: s._id || s.id,
          title: s.serviceName || "Untitled Service",
          description: s.description || "No description provided.",
          price: s.price != null ? `Rs. ${Number(s.price).toLocaleString("en-LK")}` : "Price not set",
        }));

        if (myFetchFailed && allFetchFailed) {
          setServicesError("Unable to load services right now. Vendor service backend returned an error.");
        } else {
          setServicesError(null);
        }

        setServices(formatted);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const startEdit = () => {
    setDraft(vendor);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(vendor);
    setIsEditing(false);
  };

  const saveEdit = async () => {
    try {
      const res = await updateMeApi({
        name: draft.name,
        phone: draft.mobile,
        address: draft.location,
        profileImageUrl: draft.avatarUrl !== vendor.avatarUrl ? draft.avatarUrl : undefined,
      });

      if (res.user) {
        const updatedVendor = {
          name: res.user.name || "",
          email: res.user.email || "",
          mobile: res.user.phone || "",
          location: res.user.address || "",
          avatarUrl: res.user.profileImageUrl || "",
        };
        setVendor(updatedVendor);

        // Update localStorage to keep basic info in sync
        const currentUser = readAuthUser();
        if (currentUser) {
          localStorage.setItem("user", JSON.stringify({
            ...currentUser,
            name: res.user.name,
            email: res.user.email
          }));
        }

        toast.success("Profile updated successfully");
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("Failed to update profile");
    }
  };

  const onEditService = (id: string) => {
    navigate(`/vendor/edit-service/${id}`);
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

  if (loadingProfile) {
    return (
      <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 font-medium animate-pulse">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
            <div className="relative flex items-center justify-center pb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-14 w-14 flex items-center justify-center rounded-full bg-slate-300 text-slate-700 font-semibold text-sm overflow-hidden">
                    {(isEditing ? draft.avatarUrl : vendor.avatarUrl) ? (
                      <img
                        src={isEditing ? draft.avatarUrl : vendor.avatarUrl}
                        alt="Vendor avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(isEditing ? draft.name : vendor.name)
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
                    {vendor.name}
                  </div>
                  <div className="text-xs text-slate-500">{vendor.email}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={startEdit}
                className="absolute right-0 top-0 rounded-full p-2 text-slate-600 hover:bg-slate-100"
                title="Edit vendor details"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>

            <div className="border-t border-slate-100">
              <FieldRow
                label="Name"
                value={isEditing ? draft.name : vendor.name}
                isEditing={isEditing}
                onChange={(v) => setDraft((p) => ({ ...p, name: v }))}
              />
              <FieldRow
                label="Email account"
                value={isEditing ? draft.email : vendor.email}
                isEditing={isEditing}
                type="email"
                onChange={(v) => setDraft((p) => ({ ...p, email: v }))}
              />
              <FieldRow
                label="Mobile number"
                value={isEditing ? draft.mobile : vendor.mobile}
                isEditing={isEditing}
                onChange={(v) => setDraft((p) => ({ ...p, mobile: v }))}
              />
              <FieldRow
                label="Location"
                value={isEditing ? draft.location : vendor.location}
                isEditing={isEditing}
                onChange={(v) => setDraft((p) => ({ ...p, location: v }))}
              />
            </div>

            <div className="pt-6">
              {isEditing && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    onClick={saveEdit}
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Availability – Google Calendar */}
            <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50/60 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Availability</h3>
              <p className="text-xs text-gray-600 mb-3">
                Open Google Calendar to set your available dates and times for your services.
              </p>
              <GoogleCalendarButton />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
            <h2 className="text-center font-semibold text-slate-900">
              Your Services
            </h2>

            <div className="mt-6 space-y-4">
              {loadingServices ? (
                <div className="text-sm text-slate-500 text-center py-4">Loading services...</div>
              ) : servicesError ? (
                <div className="text-sm text-red-600 text-center py-4">{servicesError}</div>
              ) : services.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-4">No services added yet.</div>
              ) : services.map((s) => (
                <div
                  key={s.id}
                  className="relative rounded-xl bg-slate-200 px-5 py-4 text-slate-900"
                >
                  <button
                    type="button"
                    onClick={() => onEditService(s.id)}
                    className="absolute right-3 top-3 rounded-full p-1.5 text-slate-700 hover:bg-slate-300"
                    title="Edit service"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <div className="text-sm font-semibold">{s.title}</div>
                  <div className="mt-1 text-xs text-slate-700">
                    {s.description}
                  </div>
                  <div className="mt-4 text-xs font-semibold">{s.price}</div>
                </div>
              ))}

              <Link
                to="/vendor/add-service"
                className="inline-flex rounded-md bg-red-700 px-4 py-2 text-xs font-semibold text-white hover:bg-red-800"
              >
                Add Sevice
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
