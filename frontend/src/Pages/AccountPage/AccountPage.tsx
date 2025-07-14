import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  IoPerson,
  IoWallet,
  IoStatsChart,
  IoSettings,
  IoLogOut,
  IoCopy,
  IoEye,
  IoEyeOff,
  IoCheckmark,
  IoCard,
} from "react-icons/io5";
import { FaUser, FaCoins, FaHistory, FaCog } from "react-icons/fa";
import Header from "../../Components/Header/Header";

interface Transaction {
  id: string;
  type: "donation" | "validation" | "received";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

const AccountPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "profile" | "transactions" | "settings"
  >("profile");
  const [loading, setLoading] = useState(false);

  // Example user data
  const userStats = {
    donationsMade: 12,
    validationsDone: 8,
    communitiesHelped: 3,
    totalDonated: 2500,
    stellarBalance: 150.75,
    reputationScore: 98,
  };

  // Example transactions
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "donation",
      amount: 500,
      description: "Donation to San José Community",
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: "2",
      type: "validation",
      amount: 25,
      description: "Delivery validation - Las Flores Neighborhood",
      date: "2024-01-14",
      status: "completed",
    },
    {
      id: "3",
      type: "received",
      amount: 50,
      description: "Validation reward",
      date: "2024-01-13",
      status: "pending",
    },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "donation":
        return <FaCoins className="w-5 h-5 text-red-600" />;
      case "validation":
        return <IoCheckmark className="w-5 h-5 text-green-600" />;
      case "received":
        return <IoCard className="w-5 h-5 text-blue-600" />;
      default:
        return <IoWallet className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTransactionText = (type: string) => {
    switch (type) {
      case "donation":
        return "Donation";
      case "validation":
        return "Validation";
      case "received":
        return "Received";
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "verida-status-success";
      case "pending":
        return "verida-status-pending";
      case "failed":
        return "verida-status-error";
      default:
        return "verida-status-info";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      case "failed":
        return "Failed";
      default:
        return status;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <div className="verida-container pt-6">
          <Header />
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="verida-spinner mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading user information...</p>
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

        {/* Page Title */}
        <div className="mb-8 px-4">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 verida-animate-fadeIn">
              <FaUser className="inline-block mr-3 text-verida-light-green" />
              My Account
            </h1>
            <p className="text-lg text-verida-light-green/80 verida-animate-fadeIn">
              Manage your profile and user settings
            </p>
          </div>
        </div>

        {/* User Stats Cards */}
        <div className="mb-8 px-4">
          <div className="verida-grid verida-grid-4 gap-4 max-w-4xl mx-auto">
            <div className="verida-card p-6 text-center">
              <FaCoins className="text-3xl text-verida-dark-teal mb-3 mx-auto" />
              <div className="text-2xl font-bold text-verida-dark-teal">
                {userStats.donationsMade}
              </div>
              <div className="text-sm text-verida-dark-teal/70">Donations</div>
            </div>
            <div className="verida-card p-6 text-center">
              <IoCheckmark className="text-3xl text-green-600 mb-3 mx-auto" />
              <div className="text-2xl font-bold text-verida-dark-teal">
                {userStats.validationsDone}
              </div>
              <div className="text-sm text-verida-dark-teal/70">
                Validations
              </div>
            </div>
            <div className="verida-card p-6 text-center">
              <FaUser className="text-3xl text-verida-dark-teal mb-3 mx-auto" />
              <div className="text-2xl font-bold text-verida-dark-teal">
                {userStats.communitiesHelped}
              </div>
              <div className="text-sm text-verida-dark-teal/70">
                Communities
              </div>
            </div>
            <div className="verida-card p-6 text-center">
              <IoStatsChart className="text-3xl text-verida-dark-teal mb-3 mx-auto" />
              <div className="text-2xl font-bold text-verida-dark-teal">
                {userStats.reputationScore}
              </div>
              <div className="text-sm text-verida-dark-teal/70">Reputation</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 px-4">
          <div className="flex flex-wrap gap-4 justify-center max-w-lg mx-auto">
            {[
              { value: "profile", label: "Profile", icon: IoPerson },
              {
                value: "transactions",
                label: "Transactions",
                icon: FaHistory,
              },
              { value: "settings", label: "Settings", icon: FaCog },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as typeof activeTab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${
                  activeTab === tab.value
                    ? "verida-button-primary"
                    : "verida-button-outline"
                }`}
              >
                <tab.icon className="mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 pb-8">
          {activeTab === "profile" && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Profile Information
              </h2>

              <div className="verida-grid verida-grid-1 lg:verida-grid-2 gap-6">
                {/* Profile Info */}
                <div className="verida-card p-6">
                  <h3 className="text-xl font-bold text-verida-dark-teal mb-4 flex items-center">
                    <IoPerson className="mr-3" />
                    Personal Data
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-verida-dark-teal/70 text-sm mb-1">
                        Email
                      </label>
                      <p className="text-verida-dark-teal font-medium">
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-verida-dark-teal/70 text-sm mb-1">
                        User since
                      </label>
                      <p className="text-verida-dark-teal font-medium">
                        January 2024
                      </p>
                    </div>
                    <div>
                      <label className="block text-verida-dark-teal/70 text-sm mb-1">
                        Total Donated
                      </label>
                      <p className="text-verida-dark-teal font-medium text-xl">
                        ${userStats.totalDonated.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stellar Wallet */}
                <div className="verida-card p-6">
                  <h3 className="text-xl font-bold text-verida-dark-teal mb-4 flex items-center">
                    <IoWallet className="mr-3" />
                    Stellar Wallet
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-verida-dark-teal/70 text-sm mb-1">
                        Balance
                      </label>
                      <p className="text-verida-dark-teal font-medium text-xl">
                        {userStats.stellarBalance} XLM
                      </p>
                    </div>
                    <div>
                      <label className="block text-verida-dark-teal/70 text-sm mb-1">
                        Public Key
                      </label>
                      <div className="flex items-center gap-2">
                        <p className="text-verida-dark-teal font-mono text-sm truncate">
                          GCZJM35NKGVK7CH...
                        </p>
                        <button
                          onClick={() => copyToClipboard("GCZJM35NKGVK7CH...")}
                          className="verida-button-secondary p-2"
                        >
                          <IoCopy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-verida-dark-teal/70 text-sm mb-1">
                        Private Key
                      </label>
                      <div className="flex items-center gap-2">
                        <p className="text-verida-dark-teal font-mono text-sm truncate">
                          {showPrivateKey
                            ? "SCZJM35NKGVK7CH..."
                            : "••••••••••••••••••••"}
                        </p>
                        <button
                          onClick={() => setShowPrivateKey(!showPrivateKey)}
                          className="verida-button-secondary p-2"
                        >
                          {showPrivateKey ? (
                            <IoEyeOff className="w-4 h-4" />
                          ) : (
                            <IoEye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Transaction History
              </h2>

              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <FaHistory className="text-6xl text-verida-light-green/30 mx-auto mb-4" />
                  <p className="text-white text-lg mb-2">No transactions</p>
                  <p className="text-verida-light-green/70">
                    Your transactions will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="verida-card p-6 verida-animate-slideIn"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center flex-1">
                          <div className="mr-4">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-verida-dark-teal mb-1">
                              {getTransactionText(transaction.type)}
                            </h3>
                            <p className="text-verida-dark-teal/80 mb-2">
                              {transaction.description}
                            </p>
                            <p className="text-verida-dark-teal/60 text-sm">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-verida-dark-teal mb-2">
                            ${transaction.amount.toLocaleString()}
                          </div>
                          <div
                            className={`verida-status-badge ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {getStatusText(transaction.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                Settings
              </h2>

              <div className="verida-card p-6">
                <h3 className="text-xl font-bold text-verida-dark-teal mb-6 flex items-center">
                  <IoSettings className="mr-3" />
                  Account Preferences
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-verida-dark-teal mb-3">
                      Notifications
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="mr-3 rounded"
                        />
                        <span className="text-verida-dark-teal/80">
                          Donation notifications
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="mr-3 rounded"
                        />
                        <span className="text-verida-dark-teal/80">
                          Validation notifications
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 rounded" />
                        <span className="text-verida-dark-teal/80">
                          Monthly newsletter
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-verida-dark-teal mb-3">
                      Privacy
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="mr-3 rounded"
                        />
                        <span className="text-verida-dark-teal/80">
                          Public profile
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 rounded" />
                        <span className="text-verida-dark-teal/80">
                          Show statistics
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-verida-dark-teal mb-3">
                      Language
                    </h4>
                    <select className="verida-input max-w-xs">
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-verida-light-green/30">
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <IoLogOut className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
