import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { selectVendorsApi } from "../shared/api/eventClient";
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

  // TODO: Replace with your real data later (API/context)
  const categories: ServiceCategory[] = useMemo(
    () => [
      {
        id: "music",
        title: "Music",
        items: [
          {
            id: "music-1",
            name: "Amila Band",
            vendor: "Amila Band & Events",
            phone: "077 123 4567",
            price: 20000,
            imageUrl: "https://i.pravatar.cc/120?img=12",
          },
          {
            id: "music-2",
            name: "Sajith Sounds",
            vendor: "Sajith Sounds",
            phone: "077 222 3344",
            price: 50000,
            imageUrl: "https://i.pravatar.cc/120?img=13",
          },
          {
            id: "music-3",
            name: "Nuwan DJ",
            vendor: "DJ Nuwan",
            phone: "077 987 6543",
            price: 25000,
            imageUrl: "https://i.pravatar.cc/120?img=14",
          },
          {
            id: "music-4",
            name: "Amal Mix",
            vendor: "Amal Mix Pro",
            phone: "071 555 9090",
            price: 15000,
            imageUrl: "https://i.pravatar.cc/120?img=15",
          },
        ],
      },
      {
        id: "light",
        title: "Light",
        items: [
          {
            id: "light-1",
            name: "Helio Lights",
            vendor: "Helio Lights",
            phone: "077 444 1122",
            price: 18000,
            imageUrl: "https://i.pravatar.cc/120?img=16",
          },
          {
            id: "light-2",
            name: "Neon Art",
            vendor: "Neon Art",
            phone: "071 333 2211",
            price: 22000,
            imageUrl: "https://i.pravatar.cc/120?img=17",
          },
          {
            id: "light-3",
            name: "Aura Light",
            vendor: "Aura Light",
            phone: "075 111 7777",
            price: 30000,
            imageUrl: "https://i.pravatar.cc/120?img=18",
          },
          {
            id: "light-4",
            name: "Joon Arc",
            vendor: "Joon Arc",
            phone: "077 888 9999",
            price: 20000,
            imageUrl: "https://i.pravatar.cc/120?img=19",
          },
        ],
      },
      {
        id: "decor",
        title: "Decorations",
        items: [
          {
            id: "decor-1",
            name: "Aroca Decor",
            vendor: "Aroca Decor",
            phone: "077 111 2222",
            price: 35000,
            imageUrl: "https://i.pravatar.cc/120?img=20",
          },
          {
            id: "decor-2",
            name: "Noona Events",
            vendor: "Noona Events",
            phone: "071 444 5555",
            price: 42000,
            imageUrl: "https://i.pravatar.cc/120?img=21",
          },
          {
            id: "decor-3",
            name: "Lakshita Flowers",
            vendor: "Lakshita Flowers",
            phone: "077 222 8888",
            price: 30000,
            imageUrl: "https://i.pravatar.cc/120?img=22",
          },
          {
            id: "decor-4",
            name: "Joon Arch",
            vendor: "Joon Arch",
            phone: "070 000 1111",
            price: 25000,
            imageUrl: "https://i.pravatar.cc/120?img=23",
          },
        ],
      },
      {
        id: "food",
        title: "Food & Beverages",
        items: [
          {
            id: "food-1",
            name: "Royal Catering",
            vendor: "Royal Catering",
            phone: "077 123 9999",
            price: 70000,
            imageUrl: "https://i.pravatar.cc/120?img=24",
          },
          {
            id: "food-2",
            name: "Blue Spoon",
            vendor: "Blue Spoon",
            phone: "076 222 3333",
            price: 65000,
            imageUrl: "https://i.pravatar.cc/120?img=25",
          },
          {
            id: "food-3",
            name: "Shalika Cakes",
            vendor: "Shalika Cakes",
            phone: "077 777 2323",
            price: 12000,
            imageUrl: "https://i.pravatar.cc/120?img=26",
          },
        ],
      },
    ],
    []
  );

  // select ONE per category (like your design)
  const [selectedByCategory, setSelectedByCategory] = useState<
    Record<string, string | null>
  >(() => {
    const init: Record<string, string | null> = {};
    categories.forEach((c) => (init[c.id] = null));
    return init;
  });

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
          {categories.map((cat) => (
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
                        <div className="text-xs font-bold text-slate-900">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-700">
                          {item.vendor}
                        </div>
                        <div className="text-[11px] text-slate-700">
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
          <div className="rounded-2xl border border-black/10 bg-rose-300 p-4 text-rose-950">
            <div className="mb-3 text-sm font-extrabold">Budget Report</div>

            <div className="mb-3 rounded-xl bg-white/40 p-3">
              <div className="mb-2 text-xs font-extrabold">
                Selected Services
              </div>

              {selectedItems.length === 0 ? (
                <div className="text-xs opacity-80">No services selected.</div>
              ) : (
                <div className="space-y-1">
                  {selectedItems.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="truncate">{it.name}</div>
                      <div className="font-extrabold">{LKR(it.price)}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="my-2 h-px bg-black/15" />
              <div className="flex items-center justify-between text-xs font-extrabold">
                <div>Total</div>
                <div>{LKR(selectedTotal)}</div>
              </div>
            </div>

            <div className="mb-3 rounded-xl bg-white/40 p-3">
              <div className="mb-2 text-xs font-extrabold">Other Services</div>

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
                      className="w-[100px] rounded border border-rose-200 bg-white/60 px-2 py-1 text-xs outline-none focus:border-rose-400"
                    />
                    <input
                      type="number"
                      value={it.value || ""}
                      placeholder="0"
                      min={0}
                      onChange={(e) => updateOtherService(idx, "value", e.target.value)}
                      className="w-[80px] rounded border border-rose-200 bg-white/60 px-2 py-1 text-xs font-extrabold outline-none focus:border-rose-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeOtherService(idx)}
                      className="text-rose-800 hover:text-rose-950 text-sm leading-none"
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
                className="mt-2 text-[11px] font-bold text-rose-900 hover:text-rose-950 underline"
              >
                + Add service
              </button>

              <div className="my-2 h-px bg-black/15" />
              <div className="flex items-center justify-between text-xs font-extrabold">
                <div>Total</div>
                <div>{LKR(otherTotal)}</div>
              </div>
            </div>

            <div className="my-3 h-0.5 bg-black/20" />

            <div className="flex items-center justify-between text-[13px] font-black">
              <div>TOTAL</div>
              <div>{LKR(grandTotal)}</div>
            </div>

            <button
              type="button"
              onClick={downloadBudgetReport}
              className="mt-4 w-full rounded-lg bg-rose-900 py-2 text-xs font-bold text-white hover:bg-rose-950 transition-colors"
            >
              ⬇ Download Report
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