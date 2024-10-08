import { FaInstagram, FaFacebookF, FaTwitter, FaGlobeAsia } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-gray-800 text-white py-8">
      <footer className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Company Info */}
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-bold mb-4">Wanderlust, Inc</h4>
            <p className="text-gray-400 mb-4 text-sm">
              Your one-stop destination for exploring the world. Find the best places, make memories, and share your experiences with us.
            </p>
            <p className="text-gray-400">&copy; {currentYear} Wanderlust, Inc. All rights reserved.</p>
          </div>

          {/* Links Section */}
          <div className="w-full md:w-1/3 grid grid-cols-2 gap-4 md:gap-8">
            <div>
              <h5 className="text-md font-bold mb-2">About Us</h5>
              <ul>
                <li><Link to="#" className="text-gray-300 hover:text-white">Our Story</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white">Careers</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white">Blog</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white">Press</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-md font-bold mb-2">Support</h5>
              <ul>
                <li><Link to="#" className="text-gray-300 hover:text-white">Help Center</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white">Contact Us</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white">Cancellation Options</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white">FAQs</Link></li>
              </ul>
            </div>
          </div>

          {/* Social and Language/Currency */}
          <div className="w-full md:w-1/3 flex flex-col items-start md:items-end">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-4">
              <Link to="#" className="text-gray-300 hover:text-white flex items-center">
                <FaGlobeAsia className="mr-2" /> English (IN)
              </Link>
              <Link to="#" className="text-gray-300 hover:text-white">&#8377; INR</Link>
            </div>
            <div className="flex space-x-4">
              <Link to="#" className="text-gray-300 transition-transform duration-300 hover:text-white hover:scale-110 text-lg">
                <FaFacebookF />
              </Link>
              <Link to="#" className="text-gray-300 transition-transform duration-300 hover:text-white hover:scale-110 text-lg">
                <FaTwitter />
              </Link>
              <Link to="#" className="text-gray-300 transition-transform duration-300 hover:text-white hover:scale-110 text-lg">
                <FaInstagram />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap gap-4">
            <Link to="#" className="text-gray-300 hover:text-white">Privacy Policy</Link>
            <Link to="#" className="text-gray-300 hover:text-white">Terms & Conditions</Link>
            <Link to="#" className="text-gray-300 hover:text-white">Sitemap</Link>
            <Link to="#" className="text-gray-300 hover:text-white">Company Details</Link>
          </div>
          <p className="text-gray-400 mt-4 md:mt-0">&copy; {currentYear} RoamScape, Inc.</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
