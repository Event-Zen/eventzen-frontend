import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const otherServices = useMemo(
    () => [
      { label: "E-services", value: 15000 },
      { label: "Cater services", value: 5000 },
    ],
    []
  );

  const selectedTotal = useMemo(
    () => selectedItems.reduce((sum, it) => sum + it.price, 0),
    [selectedItems]
  );
  const otherTotal = useMemo(
    () => otherServices.reduce((sum, it) => sum + it.value, 0),
    [otherServices]
  );
  const grandTotal = selectedTotal + otherTotal;

  return (
    <div className="w-full px-6 py-6">
      <h1 className="mb-4 text-xl font-bold text-slate-900">Select Services</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* LEFT */}
        <div className="space-y-6">
          {categories.map((cat) => (
            <section key={cat.id}>
              <h2 className="mb-3 text-sm font-bold text-slate-900">
                {cat.title}
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {cat.items.map((item) => {
                  const isSelected = selectedByCategory[cat.id] === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleSelect(cat.id, item.id)}
                      className={[
                        "w-full rounded-xl border p-3 text-left transition",
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
        <aside className="lg:sticky lg:top-4">
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

              <div className="space-y-1">
                {otherServices.map((it) => (
                  <div
                    key={it.label}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="truncate">{it.label}</div>
                    <div className="font-extrabold">{LKR(it.value)}</div>
                  </div>
                ))}
              </div>

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
            onClick={() => alert("AI Support (hook up later)")}
            className="rounded-full bg-violet-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-violet-700"
          >
            🤖 AI Support
          </button>

          <button
            onClick={() => alert("Finish (navigate to next step later)")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;