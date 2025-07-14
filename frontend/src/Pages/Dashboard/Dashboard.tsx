import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Options from "../../Components/Options/Options";
import { FaBuildingColumns } from "react-icons/fa6";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaBoxOpen } from "react-icons/fa";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
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
  totalCommunities: number;
  totalAmount: number;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalDonations: 0,
    successRate: 0,
    totalCommunities: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const statsResponse = await apiService.getStatistics();
      setStats(statsResponse);
    } catch (error) {
      console.error("Error loading statistics:", error);
      setError("Error loading statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-verida-dark-teal via-verida-dark-purple to-verida-purple">
      {/* Header with User Info */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center transform hover:scale-110 transition-transform">
              <img
                src="/Logo Vectorizado Verida.svg"
                alt="Verida Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">
                Verida Dashboard
              </h1>
              <p className="text-verida-light-green text-sm">
                Welcome, {user?.name || user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-white font-medium">
                {user?.name || "User"}
              </span>
              <span className="text-verida-light-green text-sm">
                {user?.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Statistics Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">
              Real-Time Statistics
            </h2>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="verida-card animate-pulse">
                    <div className="h-8 bg-white/10 rounded mb-4"></div>
                    <div className="h-12 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
                <p className="text-red-200">{error}</p>
                <button
                  onClick={loadDashboardData}
                  className="mt-4 px-4 py-2 bg-red-500/30 hover:bg-red-500/40 text-white rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="verida-card group hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <FaHandHoldingHeart className="text-3xl text-verida-light-green" />
                    <div className="w-12 h-12 bg-gradient-to-r from-verida-green to-verida-light-green rounded-full flex items-center justify-center">
                      <FaArrowTrendUp className="text-verida-dark-teal" />
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Total Donations
                  </h3>
                  <p className="text-3xl font-bold text-verida-light-green">
                    {stats.totalDonations}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">Active donations</p>
                </div>

                <div className="verida-card group hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <FaChartLine className="text-3xl text-verida-purple" />
                    <div className="w-12 h-12 bg-gradient-to-r from-verida-purple to-verida-dark-purple rounded-full flex items-center justify-center">
                      <FaArrowTrendUp className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Success Rate
                  </h3>
                  <p className="text-3xl font-bold text-verida-purple">
                    {stats.successRate}%
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Completed deliveries
                  </p>
                </div>

                <div className="verida-card group hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <FaUsers className="text-3xl text-verida-green" />
                    <div className="w-12 h-12 bg-gradient-to-r from-verida-green to-verida-light-green rounded-full flex items-center justify-center">
                      <FaUsers className="text-verida-dark-teal" />
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Communities
                  </h3>
                  <p className="text-3xl font-bold text-verida-green">
                    {stats.totalCommunities}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Active communities
                  </p>
                </div>

                <div className="verida-card group hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">💰</span>
                    <div className="w-12 h-12 bg-gradient-to-r from-verida-green to-verida-light-green rounded-full flex items-center justify-center">
                      <span className="text-verida-dark-teal font-bold">$</span>
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Total Donated
                  </h3>
                  <p className="text-3xl font-bold text-verida-light-green">
                    ${stats.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">USD in donations</p>
                </div>
              </div>
            )}
          </section>

          {/* Navigation Options */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8">
              What would you like to do?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {optionsData.map((option, index) => (
                <Options
                  key={index}
                  color={option.color}
                  text={option.text}
                  icon={option.icon}
                  page={option.page}
                  description={option.description}
                />
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="mt-12">
            <div className="bg-gradient-to-r from-verida-green/20 to-verida-light-green/20 rounded-2xl p-8 border border-verida-green/30">
              <h3 className="text-2xl font-bold text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/donations"
                  className="flex items-center space-x-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                >
                  <FaBuildingColumns className="text-verida-light-green text-xl" />
                  <span className="text-white font-medium">New Donation</span>
                </Link>
                <Link
                  to="/communities"
                  className="flex items-center space-x-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                >
                  <FaPeopleGroup className="text-verida-purple text-xl" />
                  <span className="text-white font-medium">
                    View Communities
                  </span>
                </Link>
                <Link
                  to="/account"
                  className="flex items-center space-x-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                >
                  <FaUser className="text-verida-light-green text-xl" />
                  <span className="text-white font-medium">My Profile</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
