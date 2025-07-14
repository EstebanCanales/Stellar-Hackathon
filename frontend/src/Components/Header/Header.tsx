import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const Header = () => {
  return (
    <div className="flex items-center justify-between w-full">
      <Link to="/" className="flex items-center group">
        {/* Logo Container */}
        <div className="flex items-center">
          {/* Verida Logo */}
          <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
            <img
              src="/Logo Vectorizado Verida.svg"
              alt="Verida Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </Link>

      {/* Navigation - Only visible on larger screens */}
      <nav className="hidden lg:flex items-center space-x-6">
        <Link
          to="/donations"
          className="text-verida-light-green hover:text-white transition-colors duration-300 font-medium"
        >
          Donations
        </Link>
        <Link
          to="/communities"
          className="text-verida-light-green hover:text-white transition-colors duration-300 font-medium"
        >
          Communities
        </Link>
        <Link
          to="/deliverys"
          className="text-verida-light-green hover:text-white transition-colors duration-300 font-medium"
        >
          Deliveries
        </Link>
        <Link to="/account" className="verida-button-primary px-4 py-2 text-sm">
          My Account
        </Link>
      </nav>

      {/* Mobile Home Button */}
      <Link
        to="/"
        className="lg:hidden w-10 h-10 bg-verida-green hover:bg-verida-green-dark rounded-full flex items-center justify-center transition-all duration-300 shadow-verida-md hover:shadow-verida-lg"
      >
        <FaHome className="text-verida-dark-teal text-lg" />
      </Link>
    </div>
  );
};

export default Header;
