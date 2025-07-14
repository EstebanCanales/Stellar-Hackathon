import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../Components/Header/Header";
import Options from "../../Components/Options/Options";
import { FaBuildingColumns } from "react-icons/fa6";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaBoxOpen } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import {
  FaArrowTrendUp,
  FaHandHoldingHeart,
  FaUsers,
  FaChartLine,
} from "react-icons/fa6";
import { apiService } from "../../services/api";

const optionsData = [
  {
    color: "#85b79d",
    text: "NGO",
    icon: FaBuildingColumns,
    page: "/donations",
    description: "Manage transparent donations",
  },
  {
    color: "#8b728e",
    text: "Validate delivery",
    icon: FaBoxOpen,
    page: "/deliverys",
    description: "Verify community deliveries",
  },
  {
    color: "#694873",
    text: "Community",
    icon: FaPeopleGroup,
    page: "/communities",
    description: "Community profile",
  },
  {
    color: "#c0e5c8",
    text: "User",
    icon: FaUser,
    page: "/account",
    description: "Your profile and transactions",
  },
];

interface DashboardStats {
  totalDonations: number;
  successRate: number;
  activeCommunities: number;
  totalAmount: number;
}

const Home = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalDonations: 0,
    successRate: 75,
    activeCommunities: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load real backend data
      const [donationsResponse, communitiesResponse] = await Promise.all([
        apiService.getDonations(),
        apiService.getCommunities(),
      ]);

      const donations = donationsResponse.donations || [];
      const communities = communitiesResponse.communities || [];

      // Calculate real statistics
      const completedDonations = donations.filter(
        (d) => d.status === "Completed"
      ).length;
      const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
      const successRate =
        donations.length > 0
          ? (completedDonations / donations.length) * 100
          : 75;

      setStats({
        totalDonations: donations.length,
        successRate: Math.round(successRate),
        activeCommunities: communities.length,
        totalAmount,
      });
    } catch (error) {
      console.error("Error loading statistics:", error);
      setError("Error loading statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <div className="verida-container pt-6">
          <Header />
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="verida-spinner mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="verida-container">
        {/* Header */}
        <div className="pt-6 pb-4">
          <Header />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-verida-green to-verida-light-green bg-clip-text text-transparent">
              Verida
            </span>
          </h1>
          <p className="text-xl text-verida-light-green/80 max-w-2xl mx-auto">
            Transparent donation platform connecting NGOs with marginalized
            communities using Stellar blockchain technology
          </p>
        </div>

        {/* Stats Section */}
        {error ? (
          <div className="mb-8 px-4">
            <div className="bg-error/20 border border-error/30 text-white p-4 rounded-lg max-w-2xl mx-auto">
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="mb-8 px-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-verida-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
                Real-Time Impact
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Donations */}
                <div
                  className="text-center verida-animate-slideIn"
                  style={{ animationDelay: "0s" }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <FaHandHoldingHeart className="text-verida-light-green text-2xl mr-2" />
                    <div className="text-3xl md:text-4xl font-bold text-white">
                      {stats.totalDonations}
                    </div>
                  </div>
                  <div className="text-verida-light-green text-sm md:text-base font-medium">
                    Total Donations
                  </div>
                </div>

                {/* Success Rate */}
                <div
                  className="text-center verida-animate-slideIn"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <FaArrowTrendUp className="text-verida-green text-2xl mr-2" />
                    <div className="text-3xl md:text-4xl font-bold text-white">
                      {stats.successRate}%
                    </div>
                  </div>
                  <div className="text-verida-light-green text-sm md:text-base font-medium">
                    Success Rate
                  </div>
                </div>

                {/* Active Communities */}
                <div
                  className="text-center verida-animate-slideIn"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <FaUsers className="text-verida-purple text-2xl mr-2" />
                    <div className="text-3xl md:text-4xl font-bold text-white">
                      {stats.activeCommunities}
                    </div>
                  </div>
                  <div className="text-verida-light-green text-sm md:text-base font-medium">
                    Active Communities
                  </div>
                </div>

                {/* Total Amount */}
                <div
                  className="text-center verida-animate-slideIn"
                  style={{ animationDelay: "0.3s" }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <FaChartLine className="text-verida-dark-teal text-2xl mr-2" />
                    <div className="text-3xl md:text-4xl font-bold text-white">
                      ${stats.totalAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-verida-light-green text-sm md:text-base font-medium">
                    Total Donated
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Options */}
        <div className="px-4 pb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
            What do you want to do today?
          </h2>

          <div className="verida-grid verida-grid-2 lg:verida-grid-4 gap-4 max-w-4xl mx-auto">
            {optionsData.map(
              ({ color, icon, text, page, description }, index) => (
                <div
                  key={index}
                  className="verida-animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
                >
                  <Link to={page} className="block group">
                    <div className="verida-card p-6 text-center hover:scale-105 transition-all duration-300">
                      <div className="flex items-center justify-center mb-4">
                        {icon &&
                          React.createElement(icon, {
                            size: 40,
                            className:
                              "text-verida-dark-teal group-hover:scale-110 transition-transform duration-300",
                          })}
                      </div>
                      <h3 className="text-lg font-bold text-verida-dark-teal mb-2">
                        {text}
                      </h3>
                      <p className="text-sm text-verida-dark-teal/70">
                        {description}
                      </p>
                    </div>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="px-4 pb-8">
          <div className="bg-gradient-secondary rounded-2xl p-6 md:p-8 text-center shadow-verida-lg">
            <h3 className="text-2xl md:text-3xl font-bold text-verida-dark-teal mb-4">
              Join the transparency revolution
            </h3>
            <p className="text-verida-dark-teal/80 mb-6 max-w-2xl mx-auto">
              Every donation matters, every transaction is transparent, every
              impact is verifiable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/donations"
                className="verida-button-primary inline-block px-8 py-3 text-center"
              >
                Create Donation
              </Link>
              <Link
                to="/communities"
                className="verida-button-outline inline-block px-8 py-3 text-center"
              >
                Explore Communities
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-4 pb-6 text-center">
          <p className="text-verida-light-green/70 text-sm">
            Powered by Stellar Blockchain | Developed with ❤️ to create a more
            transparent world
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
