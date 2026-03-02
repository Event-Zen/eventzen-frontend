import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type ServiceForm = {
  serviceType: string;
  description: string;
  price: string;
};

export default function AddServicePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<ServiceForm>({
    serviceType: "",
    description: "",
    price: "",
  });

  const setField = <K extends keyof ServiceForm>(key: K, value: ServiceForm[K]) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const onCancel = () => {
    navigate("/vendor-profile");
  };

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Replace this part with API call
    console.log("Add Service Payload:", form);
    alert("Service added.");
    navigate("/vendor-profile");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-4xl font-bold text-slate-900">Add Service</h1>

        <div className="mt-10 flex">
          <div className="w-full max-w-sm">
            <form onSubmit={onAdd} className="space-y-5">
              <div>
                <label className="block text-xs text-slate-700">Service Type</label>
                <input
                  value={form.serviceType}
                  onChange={(e) => setField("serviceType", e.target.value)}
                  className="mt-2 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  className="mt-2 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700">Price (Rs)</label>
                <input
                  value={form.price}
                  onChange={(e) => setField("price", e.target.value)}
                  className="mt-2 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div className="pt-6">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="rounded bg-red-700 px-6 py-2 text-xs font-semibold text-white hover:bg-red-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded bg-blue-600 px-8 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="flex-1" />
        </div>
      </div>
    </div>
  );
}