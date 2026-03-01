import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

type Testimonial = {
  name: string;
  role?: string;
  text: string;
  image: string; // public path
};

const TestimonialsSection = () => {
  const testimonials: Testimonial[] = useMemo(
    () => [
      {
        name: "Peheliya Navod",
        role: "Event Organizer",
        text:
          "EventZen made organizing my first event so much easier. The AI-assisted planning, vendor marketplace, and real-time budget tracking were lifesavers. Communication tools kept everything aligned, and attendee management was seamless. Thanks to EventZen, my event was a huge success, highly recommended!",
        image: "/images/client1.jpg",
      },
      {
        name: "Kavinduni Umayangana",
        role: "Planner",
        text:
          "The platform’s workflow is smooth and the interface is simple. Scheduling, vendor coordination, and ticketing all in one place saved a lot of time for our team.",
        image: "/images/client2.jpg",
      },
      {
        name: "Chamodh Jayasumana",
        role: "Attendee",
        text:
          "Finding events and registering was super easy. The reminders and event details were clear, and the experience felt modern and reliable.",
        image: "/images/client3.jpg",
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const active = testimonials[index];

  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((i) => (i + 1) % testimonials.length);

  return (
    <section className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title */}
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-12">
          What Our Clients Say
        </h2>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left image card */}
          <div className="bg-[#EAF4FF] rounded-2xl p-8 flex justify-center">
            <img
              src={active.image}
              alt={active.name}
              className="rounded-xl w-80 h-100 object-cover"
            />
          </div>

          {/* Right quote */}
          <div className="relative">
            <div className="text-gray-300 mb-6">
              <Quote size={44} />
            </div>

            <p className="text-sm leading-6 text-gray-600 max-w-lg">
              {active.text}
            </p>

            <p className="mt-6 text-sm font-semibold text-gray-900">
              {active.name}
              {active.role ? (
                <span className="text-gray-500 font-normal"> — {active.role}</span>
              ) : null}
            </p>

            {/* Navigation buttons */}
            <div className="mt-10 flex justify-end items-center gap-3">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="text-blue-600" />
              </button>

              <button
                onClick={next}
                className="w-12 h-12 rounded-md bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition"
                aria-label="Next testimonial"
              >
                <ChevronRight className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;