import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVendorService } from "../shared/api/vendorClient";
import { toast } from "react-hot-toast";

type ServiceForm = {
  serviceName: string;
  serviceType: string;
  description: string;
  price: string;
  vendorEmail: string;
  vendorPhone: string;
};

const SERVICE_CATEGORIES = [
  { id: "music", title: "Music" },
  { id: "light", title: "Light" },
  { id: "decor", title: "Decorations" },
  { id: "food", title: "Food & Beverages" },
];

export default function AddServicePage() {
  const navigate = useNavigate();

  const getLoggedInVendorEmail = () => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return "";
    try {
      const parsed = JSON.parse(rawUser);
      return parsed?.email || "";
    } catch {
      return "";
    }
  };

  const loggedInVendorEmail = getLoggedInVendorEmail();

  const [form, setForm] = useState<ServiceForm>({
    serviceName: "",
    serviceType: "",
    description: "",
    price: "",
    vendorEmail: loggedInVendorEmail,
    vendorPhone: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const setField = <K extends keyof ServiceForm>(key: K, value: ServiceForm[K]) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const onCancel = () => {
    navigate("/vendor-profile");
  };

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createVendorService({
        serviceName: form.serviceName,
        category: form.serviceType,
        description: form.description,
        price: Number(form.price),
        vendorEmail: form.vendorEmail || loggedInVendorEmail,
        vendorPhone: form.vendorPhone,
        availableDates: [new Date()], // Just defaulting to now for creation
      });
      toast.success("Service added successfully.");
      navigate("/vendor-profile");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Failed to add service");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
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

      {/* Centered Card */}
      <div className="w-full max-w-md rounded-xl bg-white shadow border border-gray-200 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Service</h1>
        <p className="text-sm text-gray-600 mt-1">List a new service for your vendor profile</p>

        <form onSubmit={onAdd} className="mt-6 space-y-4">
          <Field label="Service Name">
            <input
              required
              value={form.serviceName}
              onChange={(e) => setField("serviceName", e.target.value)}
              className="input"
              placeholder="e.g. Premium DJ Setup"
            />
          </Field>

          <Field label="Service Category">
            <select
              required
              value={form.serviceType}
              onChange={(e) => setField("serviceType", e.target.value)}
              className="input"
            >
              <option value="">Select a service category</option>
              {SERVICE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Description">
            <input
              required
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              className="input"
              placeholder="Describe your service"
            />
          </Field>

          <Field label="Price (Rs)">
            <input
              required
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              className="input"
              placeholder="0"
              type="number"
              min="0"
            />
          </Field>

          <Field label="Vendor Email">
            <input
              required
              type="email"
              value={form.vendorEmail}
              onChange={(e) => setField("vendorEmail", e.target.value)}
              className="input"
              placeholder="your.email@example.com"
              readOnly={!!loggedInVendorEmail}
            />
          </Field>

          <Field label="Vendor Phone Number">
            <input
              required
              type="tel"
              value={form.vendorPhone}
              onChange={(e) => setField("vendorPhone", e.target.value)}
              className="input"
              placeholder="e.g. 077 123 4567"
            />
          </Field>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-gray-300 text-gray-700 py-2.5 font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-blue-600 text-white py-2.5 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}