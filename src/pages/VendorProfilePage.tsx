import React, { useMemo, useState } from "react";
import { Pencil } from "lucide-react";

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
  const initialVendor: Vendor = useMemo(
    () => ({
      name: "Dhanuka Navod",
      email: "dhanuka@gmail.com",
      mobile: "(+94) 77 1231234",
      location: "Dehigahalanda, Ambalantota",
      avatarUrl: "",
    }),
    [],
  );

  const [vendor, setVendor] = useState<Vendor>(initialVendor);
  const [draft, setDraft] = useState<Vendor>(initialVendor);
  const [isEditing, setIsEditing] = useState(false);

  const [services] = useState<VendorService[]>([
    {
      id: "1",
      title: "Music",
      description:
        "High Quality sound for any type of event for a reasonable price !",
      price: "Rs. 5,000 only",
    },
  ]);

  const startEdit = () => {
    setDraft(vendor);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(vendor);
    setIsEditing(false);
  };

  const saveEdit = () => {
    setVendor(draft);
    setIsEditing(false);
  };

  const onEditService = (id: string) => {
    alert(`Edit service (demo): ${id}`);
  };

  const onAddService = () => {
    alert("Add service (demo)");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
            <div className="relative flex items-center justify-center pb-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 flex items-center justify-center rounded-full bg-slate-300 text-slate-700 font-semibold text-sm overflow-hidden">
                  {vendor.avatarUrl ? (
                    <img
                      src={vendor.avatarUrl}
                      alt="Vendor avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(vendor.name)
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
              {!isEditing ? (
                <button
                  type="button"
                  className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  onClick={() =>
                    alert("Saved (demo). Click edit icon to modify.")
                  }
                >
                  Save Change
                </button>
              ) : (
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
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
            <h2 className="text-center font-semibold text-slate-900">
              Your Services
            </h2>

            <div className="mt-6 space-y-4">
              {services.map((s) => (
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

              <button
                type="button"
                onClick={onAddService}
                className="inline-flex rounded-md bg-red-700 px-4 py-2 text-xs font-semibold text-white hover:bg-red-800"
              >
                Add Sevice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
