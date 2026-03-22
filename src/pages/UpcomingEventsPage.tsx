import { useNavigate } from "react-router-dom";

type EventItem = {
  id: string;
  title: string;
  description: string;
  ticketPrice: string;
  image?: string;
};

const upcomingEvents: EventItem[] = [
  {
    id: "1",
    title: "Gala Night Extravaganza",
    description:
      "A glamorous evening filled with live music, exquisite dining, and dancing. Perfect for corporate gatherings or charity fundraisers.",
    ticketPrice: "Rs. 1,000.00",
    image: "/images/events/event1.jpg",
  },
  {
    id: "2",
    title: "Cultural Carnival",
    description:
      "A celebration of diverse cultures with traditional music, dance, food, and crafts from around the world.",
    ticketPrice: "Rs. 1,000.00",
    image: "/images/events/event2.jpg",
  },
  {
    id: "3",
    title: "Music Mania",
    description:
      "A live music festival featuring performances from various genres and artists. Ideal for music lovers looking to enjoy a day of great tunes and good vibes.",
    ticketPrice: "Rs. 1,000.00",
    image: "/images/events/event3.jpg",
  },
  {
    id: "4",
    title: "Foodie Fest",
    description:
      "A culinary festival with food trucks, gourmet chefs, tastings, and fun food-related workshops.",
    ticketPrice: "Rs. 1,500.00",
    image: "/images/events/event4.jpg",
  },
  {
    id: "5",
    title: "Tech Meetup 2026",
    description:
      "An engaging meetup for developers, designers, and tech enthusiasts to network and share ideas.",
    ticketPrice: "Rs. 750.00",
    image: "/images/events/event5.jpg",

  },
  {
    id: "6",
    title: "Art & Craft Expo",
    description:
      "Explore creative works, handmade items, live demonstrations, and inspiring local artists.",
    ticketPrice: "Rs. 500.00",
    image: "/images/events/event6.jpg",
  },
];

export default function UpcomingEventsPage() {
  const navigate = useNavigate();

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