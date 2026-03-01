import HomeCarousel from "../components/HomeCarousel";
import ServicesSection from "../components/Services";
import TestimonialsSection from "../components/TestimonialSection";

const HomePage = () => {
  return (
    <div>
      <HomeCarousel />
      <ServicesSection />
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;