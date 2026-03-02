import React from "react";

type Vendor = {
  name: string;
  email: string;
  mobile: string;
  location: string;
  avatarUrl?: string;
};

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 items-center gap-6 border-b border-slate-100 py-5">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="text-right">
        <span className="text-sm text-slate-800">{value || "—"}</span>
      </div>
    </div>
  );
}

// This dummy data should be replace from API call
export default function VendorProfilePage() {
  const vendor: Vendor = {
    name: "Dhanuka Navod",
    email: "dhanuka@gmail.com",
    mobile: "(+94) 77 1231234",
    location: "Dehigahalanda, Ambalantota",
    avatarUrl: "",
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-center pb-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-full bg-slate-200" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-900">
                    {vendor.name}
                  </div>
                  <div className="text-xs text-slate-500">{vendor.email}</div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100">
              <FieldRow label="Name" value={vendor.name} />
              <FieldRow label="Email account" value={vendor.email} />
              <FieldRow label="Mobile number" value={vendor.mobile} />
              <FieldRow label="Location" value={vendor.location} />
            </div>

            <div className="pt-6">
              <button
                type="button"
                className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Save Change
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
