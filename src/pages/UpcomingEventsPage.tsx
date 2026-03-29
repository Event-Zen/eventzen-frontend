import { useMemo, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthUser } from "../features/auth/hooks/useAuthUser";
import { listPublishedEvents } from "../shared/api/eventClient";

type EventItem = {
  id: string;
  title: string;
  description: string;
  ticketPrice: string;
  rawPrice: number;
  image?: string;
};

type BackendEvent = {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  imageBase64?: string;
};

export default function UpcomingEventsPage() {
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const [searchParams] = useSearchParams();
  const searchTerms = searchParams.get("q") || "";

  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAttendee = user?.role === "ATTENDEE";

  const filteredEvents = useMemo(() => {
    if (!searchTerms.trim()) return upcomingEvents;
    const lower = searchTerms.toLowerCase();
    return upcomingEvents.filter(
      (ev) =>
        ev.title.toLowerCase().includes(lower) ||
        ev.description.toLowerCase().includes(lower)
    );
  }, [upcomingEvents, searchTerms]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const responseData = await listPublishedEvents();
        const data = responseData.data || [];
        const mappedEvents: EventItem[] = data.map((ev: BackendEvent, i: number) => {
          let displayDesc = ev.description || "";
          let price = "Free";
          let rawPrice = 0;

          if (displayDesc.includes(" | Capacity: ")) {
            const parts = displayDesc.split(" | ");
            displayDesc = parts[0] || "";

            const pricePart = parts.find((p: string) => p.startsWith("Price: "));
            if (pricePart) {
              const priceVal = pricePart.replace("Price: ", "").trim();
              if (priceVal && priceVal !== "Free" && priceVal !== "0") {
                rawPrice = Number(priceVal);
                price = `Rs. ${rawPrice.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;
              }
            }
          }

          return {
            id: ev._id,
            title: ev.title,
            description: displayDesc,
            ticketPrice: price,
            rawPrice: rawPrice,
            image: ev.imageBase64 || ev.image || `/images/events/event${(i % 6) + 1}.jpg`,
          };
        });
        setUpcomingEvents(mappedEvents);
      } catch (err: any) {
        setError(err.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const onBuy = (event: EventItem) => {
    console.log("Selected event:", event.id);
    navigate("/payment", { state: { eventId: event.id, amount: event.rawPrice || 50 } });
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-slate-50 px-6 py-10 flex items-center justify-center">
        <p className="text-xl font-semibold text-slate-500 animate-pulse">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-slate-50 px-6 py-10 flex items-center justify-center">
        <p className="text-xl font-semibold text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 text-4xl font-bold tracking-wide text-slate-900 uppercase">
          Upcoming Events
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-xl text-slate-400">
                {searchTerms
                  ? `No events found matching "${searchTerms}"`
                  : "No upcoming events found."}
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md flex flex-col"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="mb-3 h-40 w-full rounded-xl object-cover"
                />

                <h2 className="text-lg font-semibold text-slate-900 line-clamp-1">
                  {event.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3 flex-grow">
                  {event.description}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">
                    Ticket Price : {event.ticketPrice}
                  </span>

                  <button
                    type="button"
                    onClick={() => isAttendee && onBuy(event)}
                    disabled={!isAttendee}
                    title={!isAttendee ? "Only attendees can purchase tickets" : ""}
                    className={`rounded-md px-4 py-2 text-xs font-semibold text-white transition-all
                      ${isAttendee
                        ? "bg-red-700 hover:bg-red-800"
                        : "bg-slate-400 cursor-not-allowed grayscale"
                      }
                    `}
                  >
                    {isAttendee ? "Buy Ticket" : "Buy (Attendees Only)"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}