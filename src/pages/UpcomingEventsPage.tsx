import React from "react";
import { useNavigate } from "react-router-dom";
import { listPublishedEvents } from "../shared/api/eventClient";

type BackendEvent = {
  _id: string;
  title: string;
  description?: string;
  image?: string;
};


type EventItem = {
  id: string;
  title: string;
  description: string;
  ticketPrice: string;
  image?: string;
};



export default function UpcomingEventsPage() {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = React.useState<EventItem[]>([]);
  React.useEffect(() => {
    async function fetchEvents() {
      try {
        const responseData = await listPublishedEvents();
        const data = responseData.data || [];
        const mappedEvents: EventItem[] = data.map((ev: BackendEvent, i: number) => ({
          id: ev._id,
          title: ev.title,
          description: ev.description || "",
          ticketPrice: "Rs. 1,000.00",
          image: ev.image || `/images/events/event${(i % 6) + 1}.jpg`
        }));
        setUpcomingEvents(mappedEvents);
      } catch (err: any) {}
    }
    fetchEvents();
  }, []);

  const onBuy = (eventId: string) => {
    console.log("Selected event:", eventId);
    navigate("/payment");
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 text-4xl font-bold tracking-wide text-slate-900">
          UPCOMING EVENTS
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <img
                src={event.image}
                alt={event.title}
                className="mb-3 h-40 w-full rounded-xl object-cover"
              />

              <h2 className="text-lg font-semibold text-slate-900">
                {event.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {event.description}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">
                  Ticket Price : {event.ticketPrice}
                </span>

                <button
                  type="button"
                  onClick={() => onBuy(event.id)}
                  className="rounded-md bg-red-700 px-4 py-2 text-xs font-semibold text-white hover:bg-red-800"
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}