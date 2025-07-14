import React from "react";
import { Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaUsers,
  FaHandHoldingHeart,
  FaEye,
  FaCheckCircle,
  FaArrowRight,
  FaStar,
  FaGlobe,
} from "react-icons/fa";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-verida-dark-teal via-verida-dark-purple to-verida-purple">
      {/* Navigation */}
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-20 md:w-30 h-20 md:h-30 flex items-center justify-center transform hover:scale-110 transition-transform">
              <img
                src="/Logo Vectorizado Verida.svg"
                alt="Verida Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <Link
              to="/login"
              className="px-6 py-2 text-white border border-verida-green rounded-lg hover:bg-verida-green hover:text-verida-dark-teal transition-all duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="px-6 py-2 bg-gradient-to-r from-verida-green to-verida-light-green text-verida-dark-teal rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Comenzar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Transparent{" "}
            <span className="bg-gradient-to-r from-verida-green to-verida-light-green bg-clip-text text-transparent">
              Donations
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            We connect NGOs with marginalized communities using Stellar
            blockchain technology to guarantee total transparency in every
            donation
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/login"
              className="px-8 py-4 bg-gradient-to-r from-verida-green to-verida-light-green text-verida-dark-teal rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              <FaArrowRight className="mr-2" />
              Start Now
            </Link>
            <button className="px-8 py-4 border-2 border-verida-green text-white rounded-xl font-bold text-lg hover:bg-verida-green hover:text-verida-dark-teal transition-all duration-300">
              View Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-verida-light-green">
                50+
              </div>
              <div className="text-gray-400">Communities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-verida-light-green">
                $125K
              </div>
              <div className="text-gray-400">Donated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-verida-light-green">
                98%
              </div>
              <div className="text-gray-400">Transparency</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-verida-light-green">
                15+
              </div>
              <div className="text-gray-400">NGOs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Why choose{" "}
            <span className="bg-gradient-to-r from-verida-green to-verida-light-green bg-clip-text text-transparent">
              Verida?
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-verida-green to-verida-light-green rounded-xl flex items-center justify-center mb-6">
                <FaShieldAlt className="text-2xl text-verida-dark-teal" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                100% Transparent
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Every donation is verified on Stellar blockchain. Donors can
                track exactly how their money is used.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-verida-purple to-verida-dark-purple rounded-xl flex items-center justify-center mb-6">
                <FaUsers className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Community Validation
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Communities validate deliveries directly, ensuring donations
                reach those who need them.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-verida-green to-verida-light-green rounded-xl flex items-center justify-center mb-6">
                <FaHandHoldingHeart className="text-2xl text-verida-dark-teal" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Real Impact</h3>
              <p className="text-gray-300 leading-relaxed">
                We directly connect donors with marginalized communities,
                maximizing the impact of every donation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            How it{" "}
            <span className="bg-gradient-to-r from-verida-green to-verida-light-green bg-clip-text text-transparent">
              Works
            </span>
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-verida-green to-verida-light-green rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-verida-dark-teal">
                  1
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                NGO Creates Donation
              </h3>
              <p className="text-gray-400">
                NGOs publish specific needs from verified communities
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-verida-purple to-verida-dark-purple rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Secure Donation
              </h3>
              <p className="text-gray-400">
                Funds are deposited in a smart contract on Stellar
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-verida-green to-verida-light-green rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-verida-dark-teal">
                  3
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Verified Delivery
              </h3>
              <p className="text-gray-400">
                Community confirms receipt of goods or services
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-verida-purple to-verida-dark-purple rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Automatic Release
              </h3>
              <p className="text-gray-400">
                Funds are automatically released after validation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-verida-green/20 to-verida-light-green/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to make transparent donations?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join the transparency revolution in donations. Connect with
            communities that truly need your help.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-verida-green to-verida-light-green text-verida-dark-teal rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <FaArrowRight className="mr-3" />
            Start Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-verida-green to-verida-light-green rounded-lg flex items-center justify-center">
                <span className="text-verida-dark-teal font-bold">V</span>
              </div>
              <span className="text-white font-semibold">Verida</span>
            </div>

            <div className="flex space-x-6 text-gray-400">
              <a
                href="#"
                className="hover:text-verida-light-green transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-verida-light-green transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-verida-light-green transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 Verida. Built with ❤️ for transparent communities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
