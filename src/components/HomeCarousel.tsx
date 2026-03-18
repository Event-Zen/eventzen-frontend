import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";
import { useAuthUser } from "../features/auth/hooks/useAuthUser";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

type Slide = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
};

const slides: Slide[] = [
  {
    id: 1,
    image: "/images/slide1.jpg",
    title: "EVENTZEN",
    subtitle: "SIMPLIFY EVENT PLANNING AND MAKE EVERY MOMENT UNFORGETTABLE.",
  },
  {
    id: 2,
    image: "/images/slide2.jpg",
    title: "EVENTZEN",
    subtitle: "DISCOVER EVENTS, BOOK TICKETS, AND ENJOY THE EXPERIENCE.",
  },
  {
    id: 3,
    image: "/images/slide3.jpg",
    title: "EVENTZEN",
    subtitle: "AI-POWERED PLANNING FOR ORGANIZERS, VENDORS, AND ATTENDEES.",
  },
];

const HomeCarousel = () => {
  const { user } = useAuthUser();

  const isAttendee = user?.role === "ATTENDEE";
  const isPlanner = user?.role === "PLANNER";

  return (
    <section className="w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        loop
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="w-full h-[420px] md:h-[520px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-[420px] md:h-[520px]">
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/50" />

              {/* Center Content */}
              <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
                <div className="max-w-3xl">
                  <h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-widest drop-shadow">
                    {slide.title}
                  </h1>

                  <div className="mt-6 bg-black/35 px-6 py-4 rounded-md">
                    <p className="text-white text-lg md:text-2xl font-medium tracking-wide">
                      {slide.subtitle}
                    </p>
                  </div>

                  {/* Optional CTA Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    {isAttendee && (
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition">
                        Find Events
                      </button>
                    )}
                    {isPlanner && (
                      <Link
                        to="/create-event"
                        className="bg-white/90 hover:bg-white text-black px-6 py-3 rounded-full font-semibold transition inline-block"
                      >
                        Create Event
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HomeCarousel;