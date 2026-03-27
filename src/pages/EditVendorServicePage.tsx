import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVendorServiceById, updateVendorService } from "../shared/api/vendorClient";

type ServiceForm = {
  serviceName: string;
  serviceType: string;
  description: string;
  price: string;
  vendorEmail: string;
  vendorPhone: string;
  isActive: boolean;
};

const SERVICE_CATEGORIES = [
  { id: "music", title: "Music" },
  { id: "light", title: "Light" },
  { id: "decor", title: "Decorations" },
  { id: "food", title: "Food & Beverages" },
];

export default function EditVendorServicePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<ServiceForm>({
    serviceName: "",
    serviceType: "",
    description: "",
    price: "",
    vendorEmail: "",
    vendorPhone: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchService = async () => {
      try {
        const res = await getVendorServiceById(id);
        if (res.success && res.data) {
          const srv = res.data;
          setForm({
            serviceName: srv.serviceName || "",
            serviceType: srv.category || "",
            description: srv.description || "",
            price: srv.price ? srv.price.toString() : "",
            vendorEmail: srv.vendorEmail || "",
            vendorPhone: srv.vendorPhone || "",
            isActive: srv.isActive !== false,
          });
        }
      } catch (err: any) {
        console.error("Failed to load service details", err);
        alert("Failed to load service details");
        navigate("/vendor-profile");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id, navigate]);

  const setField = <K extends keyof ServiceForm>(key: K, value: ServiceForm[K]) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const onCancel = () => {
    navigate("/vendor-profile");
  };

  const onUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSubmitting(true);

    try {
      await updateVendorService(id, {
        serviceName: form.serviceName,
        category: form.serviceType,
        description: form.description,
        price: Number(form.price),
        vendorEmail: form.vendorEmail,
        vendorPhone: form.vendorPhone,
        isActive: form.isActive,
      });
      alert("Service updated successfully.");
      navigate("/vendor-profile");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Failed to update service");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-gray-600 font-medium">Loading service details...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Decorative Corner Squares */}
      <div className="absolute top-10 left-10 hidden md:block">
        <div className="relative h-20 w-20">
          <div className="absolute h-20 w-20 border-2 border-blue-400 rounded-lg"></div>
          <div className="absolute top-6 left-6 h-20 w-20 border-2 border-blue-300 rounded-lg"></div>
        </div>
      </div>
      <div className="absolute top-10 right-10 hidden md:block">
        <div className="relative h-20 w-20">
          <div className="absolute h-20 w-20 border-2 border-blue-400 rounded-lg"></div>
          <div className="absolute top-6 left-6 h-20 w-20 border-2 border-blue-300 rounded-lg"></div>
        </div>
      </div>
      <div className="absolute bottom-10 left-10 hidden md:block">
        <div className="relative h-20 w-20">
          <div className="absolute h-20 w-20 border-2 border-orange-400 rounded-lg"></div>
          <div className="absolute top-6 left-6 h-20 w-20 border-2 border-orange-300 rounded-lg"></div>
        </div>
      </div>
      <div className="absolute bottom-10 right-10 hidden md:block">
        <div className="relative h-20 w-20">
          <div className="absolute h-20 w-20 border-2 border-orange-400 rounded-lg"></div>
          <div className="absolute top-6 left-6 h-20 w-20 border-2 border-orange-300 rounded-lg"></div>
        </div>
      </div>

      {/* Centered Card */}
      <div className="w-full max-w-md rounded-xl bg-white shadow border border-gray-200 p-6 sm:p-8 relative z-10">
        <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
        <p className="text-sm text-gray-600 mt-1">Update details for your service</p>

        <form onSubmit={onUpdate} className="mt-6 space-y-4">
          <Field label="Service Name">
            <input
              required
              value={form.serviceName}
              onChange={(e) => setField("serviceName", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. Premium DJ Setup"
            />
          </Field>

          <Field label="Service Category">
            <select
              required
              value={form.serviceType}
              onChange={(e) => setField("serviceType", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Describe your service"
            />
          </Field>

          <Field label="Price (Rs)">
            <input
              required
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="your.email@example.com"
            />
          </Field>

          <Field label="Vendor Phone Number">
            <input
              required
              type="tel"
              value={form.vendorPhone}
              onChange={(e) => setField("vendorPhone", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. 077 123 4567"
            />
          </Field>
          
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setField("isActive", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active Service
            </label>
          </div>

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
              {submitting ? "Saving..." : "Save Changes"}
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
