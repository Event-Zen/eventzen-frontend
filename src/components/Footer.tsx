import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#2E294E] text-gray-300 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Company</h3>
            <ul className="space-y-3">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Why Choose Us</li>
              <li className="hover:text-white cursor-pointer">Pricing</li>
              <li className="hover:text-white cursor-pointer">Testimonial</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Resources</h3>
            <ul className="space-y-3">
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Terms and Condition</li>
              <li className="hover:text-white cursor-pointer">Blog</li>
              <li className="hover:text-white cursor-pointer">Contact Us</li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Product</h3>
            <ul className="space-y-3">
              <li className="hover:text-white cursor-pointer">Project Management</li>
              <li className="hover:text-white cursor-pointer">Time Tracker</li>
              <li className="hover:text-white cursor-pointer">Time Schedule</li>
              <li className="hover:text-white cursor-pointer">Lead Generate</li>
              <li className="hover:text-white cursor-pointer">Remote Collaboration</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-4 tracking-wide">
              EVENTZEN
            </h2>
            <p className="mb-6 text-gray-400">
              Subscribe to our Newsletter
            </p>

            <div className="flex bg-[#3B365F] rounded-lg overflow-hidden">
              <input
                type="email"
                placeholder="Enter your Email"
                className="bg-transparent px-1 py-3 flex-1 outline-none text-white placeholder-gray-400"
              />
              <button className="bg-gray-200 text-black px-6 font-medium hover:bg-white transition">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between border-t border-gray-600 pt-6">

          <p className="text-gray-400 mb-4 md:mb-0">
            Copyright @2025
          </p>

          <div className="flex space-x-6 text-gray-400">
            <Facebook className="hover:text-white cursor-pointer" size={20} />
            <Twitter className="hover:text-white cursor-pointer" size={20} />
            <Instagram className="hover:text-white cursor-pointer" size={20} />
            <Linkedin className="hover:text-white cursor-pointer" size={20} />
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;