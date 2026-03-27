import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { selectVendorsApi } from "../shared/api/eventClient";
import { listVendorServices } from "../shared/api/vendorClient";
import { jsPDF } from "jspdf";

type ServiceItem = {
  id: string;
  name: string;
  vendor: string;
  phone: string;
  price: number;
  imageUrl: string;
};

type ServiceCategory = {
  id: string;
  title: string;
  items: ServiceItem[];
};

const LKR = (n: number) =>
  n.toLocaleString("en-LK", { style: "currency", currency: "LKR" });

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [saving, setSaving] = useState(false);

  // Get eventId from router state or sessionStorage
  const eventId: string | null =
    (location.state as any)?.eventId || sessionStorage.getItem("activeEventId");

  // Fetch categories using API
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await listVendorServices();
        
        let dataArray = [];
        if (res && res.success && Array.isArray(res.data)) {
          dataArray = res.data;
        } else if (Array.isArray(res)) {
          dataArray = res;
        } else if (res && Array.isArray(res.data)) {
          dataArray = res.data;
        }

        if (dataArray) {
          const grouped: Record<string, ServiceItem[]> = {};
          dataArray.forEach((srv: any) => {
            if (!grouped[srv.category]) {
              grouped[srv.category] = [];
            }
            grouped[srv.category].push({
              id: srv._id,
              name: srv.serviceName,
              vendor: srv.vendorName || "Vendor",
              phone: srv.vendorPhone || "",
              price: srv.price,
              imageUrl: `https://i.pravatar.cc/120?u=${srv._id}`,
            });
          });

          const catTitles: Record<string, string> = {
            music: "Music",
            light: "Light",
            decor: "Decorations",
            food: "Food & Beverages",
          };

          const formattedCategories: ServiceCategory[] = Object.keys(grouped).map(
            (catId) => ({
              id: catId,
              title: catTitles[catId] || catId,
              items: grouped[catId],
            })
          );
          setCategories(formattedCategories);
        }
      } catch (err) {
        console.error("Failed to fetch vendor services", err);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  // select ONE per category (like your design)
  const [selectedByCategory, setSelectedByCategory] = useState<
    Record<string, string | null>
  >({});

  // Hydrate vendor selections from sessionStorage (set by PlannerProfilePage on edit)
  useEffect(() => {
    const saved = sessionStorage.getItem("serviceSelections");
    if (!saved) return;
    try {
      const parsed: Record<string, string | null> = JSON.parse(saved);
      setSelectedByCategory((prev) => ({ ...prev, ...parsed }));
    } catch (e) {
      console.error("Failed to parse saved serviceSelections", e);
    }
  }, []);

  const toggleSelect = (categoryId: string, itemId: string) => {
    setSelectedByCategory((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId] === itemId ? null : itemId,
    }));
  };

  const selectedItems = useMemo(() => {
    const items: ServiceItem[] = [];
    for (const c of categories) {
      const selectedId = selectedByCategory[c.id];
      if (!selectedId) continue;
      const found = c.items.find((i) => i.id === selectedId);
      if (found) items.push(found);
    }
    return items;
  }, [categories, selectedByCategory]);

  const [otherServices, setOtherServices] = useState<{ label: string; value: number }[]>([
    { label: "E-services", value: 15000 },
    { label: "Cater services", value: 5000 },
  ]);

  const updateOtherService = (index: number, field: "label" | "value", val: string) => {
    setOtherServices((prev) => prev.map((item, i) =>
      i === index ? { ...item, [field]: field === "value" ? (Number(val) || 0) : val } : item
    ));
  };

  const removeOtherService = (index: number) => {
    setOtherServices((prev) => prev.filter((_, i) => i !== index));
  };

  const addOtherService = () => {
    setOtherServices((prev) => [...prev, { label: "", value: 0 }]);
  };

  const selectedTotal = useMemo(
    () => selectedItems.reduce((sum, it) => sum + it.price, 0),
    [selectedItems]
  );
  const otherTotal = useMemo(
    () => otherServices.reduce((sum, it) => sum + it.value, 0),
    [otherServices]
  );
  const grandTotal = selectedTotal + otherTotal;

  // Generate and download budget report as PDF
  const downloadBudgetReport = () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // Helper to format currency
    const fmt = (n: number) => `LKR ${n.toLocaleString("en-LK")}`;

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("EventZen - Budget Report", margin, y);
    y += 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120);
    doc.text(`Generated on ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}`, margin, y);
    doc.setTextColor(0);
    y += 10;

    // Divider
    doc.setDrawColor(200);
    doc.line(margin, y, pageW - margin, y);
    y += 8;

    // Selected Services section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Selected Services", margin, y);
    y += 7;

    if (selectedItems.length === 0) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text("No services selected.", margin, y);
      y += 7;
    } else {
      // Table header
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, y - 4, pageW - margin * 2, 7, "F");
      doc.text("Service", margin + 2, y);
      doc.text("Vendor", margin + 60, y);
      doc.text("Price", pageW - margin - 2, y, { align: "right" });
      y += 7;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      selectedItems.forEach((item) => {
        doc.text(item.name, margin + 2, y);
        doc.text(item.vendor, margin + 60, y);
        doc.text(fmt(item.price), pageW - margin - 2, y, { align: "right" });
        y += 6;
      });

      // Subtotal
      doc.setDrawColor(220);
      doc.line(margin, y, pageW - margin, y);
      y += 5;
      doc.setFont("helvetica", "bold");
      doc.text("Subtotal", margin + 2, y);
      doc.text(fmt(selectedTotal), pageW - margin - 2, y, { align: "right" });
      y += 10;
    }

    // Other Services section
    const validOther = otherServices.filter((s) => s.label.trim());
    if (validOther.length > 0) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Other Services (External)", margin, y);
      y += 7;

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, y - 4, pageW - margin * 2, 7, "F");
      doc.text("Service", margin + 2, y);
      doc.text("Cost", pageW - margin - 2, y, { align: "right" });
      y += 7;

      doc.setFont("helvetica", "normal");
      validOther.forEach((item) => {
        doc.text(item.label, margin + 2, y);
        doc.text(fmt(item.value), pageW - margin - 2, y, { align: "right" });
        y += 6;
      });

      doc.setDrawColor(220);
      doc.line(margin, y, pageW - margin, y);
      y += 5;
      doc.setFont("helvetica", "bold");
      doc.text("Subtotal", margin + 2, y);
      doc.text(fmt(otherTotal), pageW - margin - 2, y, { align: "right" });
      y += 10;
    }

    // Grand total
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);
    y += 7;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("GRAND TOTAL", margin + 2, y);
    doc.text(fmt(grandTotal), pageW - margin - 2, y, { align: "right" });

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    doc.text("This report was generated by EventZen.", margin, doc.internal.pageSize.getHeight() - 10);

    doc.save("EventZen_Budget_Report.pdf");
  };

  // Save vendor selections to backend and navigate to payment
  const onFinish = async () => {
    if (!eventId) {
      alert("No event found. Please create an event first.");
      return;
    }

    if (selectedItems.length === 0) {
      alert("Please select at least one service.");
      return;
    }

    try {
      setSaving(true);

      // Build vendor payload for the API
      const vendors = selectedItems.map((item) => {
        // Find which category this item belongs to
        const cat = categories.find((c) => c.items.some((i) => i.id === item.id));
        return {
          vendorId: item.id,
          serviceId: item.id,
          price: item.price,
          category: cat?.id || "",
          vendorNameSnapshot: item.vendor,
          serviceNameSnapshot: item.name,
        };
      });

      await selectVendorsApi(eventId, { vendors, currency: "LKR" });

      // Persist selections in sessionStorage for potential re-editing
      const selectionMap: Record<string, string | null> = {};
      for (const cat of categories) {
        selectionMap[cat.id] = selectedByCategory[cat.id];
      }
      sessionStorage.setItem("serviceSelections", JSON.stringify(selectionMap));

      navigate("/payment", { state: { eventId } });
    } catch (err: any) {
      console.error("Failed to save vendor selections", err);
      alert(err.response?.data?.message || err.message || "Failed to save vendor selections.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full px-6 py-6">
      <h1 className="mb-4 text-xl font-bold text-slate-900">Select Services</h1>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_320px]">
        {/* LEFT */}
        <div className="space-y-6">
          {loadingServices ? (
            <div className="text-gray-500 text-sm">Loading services...</div>
          ) : categories.length === 0 ? (
            <div className="text-gray-500 text-sm">No services found. Add some from the vendor profile!</div>
          ) : categories.map((cat) => (
            <section key={cat.id}>
              <h2 className="mb-3 text-sm font-bold text-slate-900">
                {cat.title}
              </h2>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4 justify-items-start">
                {cat.items.map((item) => {
                  const isSelected = selectedByCategory[cat.id] === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleSelect(cat.id, item.id)}
                      className={[
                        "w-[160px] rounded-xl border p-3 text-left transition",
                        "hover:-translate-y-[1px] hover:shadow-sm",
                        isSelected
                          ? "border-emerald-400 bg-emerald-100"
                          : "border-slate-200 bg-slate-100 hover:border-slate-300",
                      ].join(" ")}
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <span
                          className={[
                            "h-4 w-4 rounded-full border-2",
                            isSelected
                              ? "border-emerald-600 bg-emerald-600"
                              : "border-slate-300 bg-white",
                          ].join(" ")}
                        />
                      </div>

                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 truncate" title={item.name}>
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-700 truncate" title={item.vendor}>
                          {item.vendor}
                        </div>
                        <div className="text-[11px] text-slate-700 truncate">
                          {item.phone}
                        </div>
                        <div className="pt-1 text-[11px] font-bold text-slate-900">
                          {LKR(item.price)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* RIGHT (Budget report) */}
        <aside className="hidden lg:block lg:self-start lg:sticky lg:top-28 h-fit">
          <div className="rounded-xl bg-white shadow border border-gray-200 p-5 sm:p-6">
            <h3 className="text-lg font-bold text-gray-900">Budget Report</h3>
            <p className="mt-1 text-xs text-gray-600">Review selected and additional costs.</p>

            <div className="mt-4 mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="mb-2 text-xs font-semibold text-gray-800">
                Selected Services
              </div>

              {selectedItems.length === 0 ? (
                <div className="text-xs text-gray-500">No services selected.</div>
              ) : (
                <div className="space-y-1">
                  {selectedItems.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between gap-3 text-xs text-gray-700"
                    >
                      <div className="truncate">{it.name}</div>
                      <div className="font-semibold text-gray-900">{LKR(it.price)}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="my-2 h-px bg-gray-200" />
              <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
                <div>Total</div>
                <div className="text-gray-900">{LKR(selectedTotal)}</div>
              </div>
            </div>

            <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="mb-2 text-xs font-semibold text-gray-800">Other Services</div>

              <div className="space-y-2">
                {otherServices.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs"
                  >
                    <input
                      type="text"
                      value={it.label}
                      placeholder="Service name"
                      onChange={(e) => updateOtherService(idx, "label", e.target.value)}
                      className="w-[100px] rounded border border-gray-300 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      value={it.value || ""}
                      placeholder="0"
                      min={0}
                      onChange={(e) => updateOtherService(idx, "value", e.target.value)}
                      className="w-[80px] rounded border border-gray-300 bg-white px-2 py-1 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeOtherService(idx)}
                      className="text-gray-500 hover:text-red-600 text-sm leading-none"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addOtherService}
                className="mt-2 text-[11px] font-semibold text-blue-600 hover:text-blue-700 underline"
              >
                + Add service
              </button>

              <div className="my-2 h-px bg-gray-200" />
              <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
                <div>Total</div>
                <div className="text-gray-900">{LKR(otherTotal)}</div>
              </div>
            </div>

            <div className="my-3 h-px bg-gray-300" />

            <div className="flex items-center justify-between rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-[13px] font-bold text-gray-900">
              <div>TOTAL</div>
              <div>{LKR(grandTotal)}</div>
            </div>

            <button
              type="button"
              onClick={downloadBudgetReport}
              className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
            >
              Download Report
            </button>
          </div>
        </aside>
      </div>

      {/* Bottom buttons */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
        >
          Back
        </button>

        <div className="flex items-center gap-3">
          

          <button
            onClick={onFinish}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Finish"}
          </button>

          <button
            onClick={() => alert("AI Support (hook up later)")}
            className="rounded-full bg-violet-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-violet-700"
          >
             ✦ AI Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;