import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const Header = () => {
  return (
    <div className="flex items-center justify-between w-full">
      <Link to="/" className="flex items-center group">
        {/* Logo Container */}
        <div className="flex items-center space-x-3">
          {/* Logo placeholder - you can replace with actual SVG */}
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-verida-md">
            <span className="text-verida-dark-teal font-bold text-lg md:text-xl">
              V
            </span>
          </div>

          {/* Brand Text */}
          <div className="hidden sm:block">
            <h1 className="text-2xl md:text-3xl font-bold text-white group-hover:text-verida-light-green transition-colors duration-300">
              Verida
            </h1>
            <p className="text-xs md:text-sm text-verida-light-green/70 -mt-1">
              Donaciones Transparentes
            </p>
          </div>
        </div>
      </Link>

      {/* Navigation - Only visible on larger screens */}
      <nav className="hidden lg:flex items-center space-x-6">
        <Link
          to="/donations"
          className="text-verida-light-green hover:text-white transition-colors duration-300 font-medium"
        >
          Donaciones
        </Link>
        <Link
          to="/communities"
          className="text-verida-light-green hover:text-white transition-colors duration-300 font-medium"
        >
          Comunidades
        </Link>
        <Link
          to="/deliverys"
          className="text-verida-light-green hover:text-white transition-colors duration-300 font-medium"
        >
          Entregas
        </Link>
        <Link to="/account" className="verida-button-primary px-4 py-2 text-sm">
          Mi Cuenta
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
