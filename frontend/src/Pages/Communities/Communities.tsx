import React, { useState, useEffect } from "react";
import {
  IoLocationOutline,
  IoCheckmarkCircle,
  IoAdd,
  IoEye,
  IoStatsChart,
  IoCheckmark,
} from "react-icons/io5";
import { FaUsers, FaHandshake, FaHeart, FaBullhorn } from "react-icons/fa";
import Header from "../../Components/Header/Header";

interface Community {
  id: string;
  name: string;
  location: string;
  verified: boolean;
  totalDonations: number;
  totalDeliveries: number;
  successRate: number;
  representative: string;
}

interface Need {
  id: string;
  title: string;
  description: string;
  priority: "urgent" | "high" | "medium" | "low";
  status: "active" | "fulfilled";
  created_at: string;
}

const Communities: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null
  );
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNeedForm, setShowNeedForm] = useState(false);
  const [newNeed, setNewNeed] = useState({
    title: "",
    description: "",
    priority: "medium" as Need["priority"],
  });

  // Example data
  useEffect(() => {
    const mockCommunities: Community[] = [
      {
        id: "1",
        name: "San José Community",
        location: "San José, Costa Rica",
        verified: true,
        totalDonations: 15,
        totalDeliveries: 12,
        successRate: 80,
        representative: "María González",
      },
      {
        id: "2",
        name: "Nueva Esperanza Village",
        location: "Guatemala, Guatemala",
        verified: true,
        totalDonations: 8,
        totalDeliveries: 7,
        successRate: 87.5,
        representative: "Carlos Mendez",
      },
      {
        id: "3",
        name: "El Progreso Neighborhood",
        location: "Managua, Nicaragua",
        verified: false,
        totalDonations: 3,
        totalDeliveries: 2,
        successRate: 66.7,
        representative: "Ana Rodríguez",
      },
    ];

    const mockNeeds: Need[] = [
      {
        id: "1",
        title: "Children's medicine",
        description:
          "We need basic medications for treating common diseases in children",
        priority: "urgent",
        status: "active",
        created_at: "2024-01-15",
      },
      {
        id: "2",
        title: "School supplies",
        description: "School supplies for the new academic year",
        priority: "high",
        status: "active",
        created_at: "2024-01-14",
      },
    ];

    setTimeout(() => {
      setCommunities(mockCommunities);
      setNeeds(mockNeeds);
      setSelectedCommunity(mockCommunities[0]);
      setLoading(false);
    }, 1000);
  }, []);

  const stats = {
    total: communities.length,
    verified: communities.filter((c) => c.verified).length,
    totalDonations: communities.reduce((sum, c) => sum + c.totalDonations, 0),
    averageSuccess:
      communities.length > 0
        ? communities.reduce((sum, c) => sum + c.successRate, 0) /
          communities.length
        : 0,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-700 border-red-300";
      case "high":
        return "bg-orange-500/20 text-orange-700 border-orange-300";
      case "medium":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-green-500/20 text-green-700 border-green-300";
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-300";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "Urgent";
      case "high":
        return "High";
      case "medium":
        return "Medium";
      case "low":
        return "Low";
      default:
        return priority;
    }
  };

  const handleAddNeed = () => {
    if (!newNeed.title || !newNeed.description) return;

    const need: Need = {
      id: Date.now().toString(),
      title: newNeed.title,
      description: newNeed.description,
      priority: newNeed.priority,
      status: "active",
      created_at: new Date().toISOString().split("T")[0],
    };

    setNeeds([...needs, need]);
    setNewNeed({ title: "", description: "", priority: "medium" });
    setShowNeedForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <div className="verida-container pt-6">
          <Header />
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="verida-spinner mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading communities...</p>
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
              <FaUsers className="inline-block mr-3 text-verida-light-green" />
              Communities
            </h1>
            <p className="text-lg text-verida-light-green/80 verida-animate-fadeIn">
              Manage and monitor beneficiary communities
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 px-4">
          <div className="verida-grid verida-grid-4 gap-4 max-w-4xl mx-auto">
            <div className="verida-card p-6 text-center">
              <FaUsers className="text-3xl text-verida-dark-teal mb-3 mx-auto" />
              <div className="text-2xl font-bold text-verida-dark-teal">
                {stats.total}
              </div>
              <div className="text-sm text-verida-dark-teal/70">
                Total Communities
              </div>
            </div>
            <div className="verida-card p-6 text-center">
              <IoCheckmarkCircle className="text-3xl text-green-600 mb-3 mx-auto" />
              <div className="text-2xl font-bold text-verida-dark-teal">
                {stats.verified}
              </div>
              <div className="text-sm text-verida-dark-teal/70">Verified</div>
            </div>
            <div className="verida-card p-6 text-center">
              <FaHeart className="text-3xl text-verida-dark-teal mb-3 mx-auto" />
              <div className="text-2xl font-bold text-verida-dark-teal">
                {stats.totalDonations}
              </div>
              <div className="text-sm text-verida-dark-teal/70">
                Donations Received
              </div>
            </div>
            <div className="verida-card p-6 text-center">
              <IoStatsChart className="text-3xl text-verida-dark-teal mb-3 mx-auto" />
              <div className="text-2xl font-bold text-verida-dark-teal">
                {stats.averageSuccess.toFixed(1)}%
              </div>
              <div className="text-sm text-verida-dark-teal/70">
                Average Success
              </div>
            </div>
          </div>
        </div>

        {/* Communities Grid */}
        <div className="px-4 pb-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Community List
          </h2>

          {communities.length === 0 ? (
            <div className="text-center py-12">
              <FaUsers className="text-6xl text-verida-light-green/30 mx-auto mb-4" />
              <p className="text-white text-lg mb-2">
                No registered communities
              </p>
              <p className="text-verida-light-green/70">
                Communities will appear here when they register
              </p>
            </div>
          ) : (
            <div className="verida-grid verida-grid-1 lg:verida-grid-2 gap-6 max-w-6xl mx-auto">
              {communities.map((community) => (
                <div
                  key={community.id}
                  className="verida-card p-6 verida-animate-slideIn"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-verida-dark-teal mb-2 flex items-center">
                        {community.name}
                        {community.verified && (
                          <IoCheckmarkCircle className="w-5 h-5 text-green-600 ml-2" />
                        )}
                      </h3>
                      <div className="flex items-center text-verida-dark-teal/70 mb-2">
                        <IoLocationOutline className="mr-2" />
                        <span className="text-sm">{community.location}</span>
                      </div>
                      <p className="text-verida-dark-teal/80 text-sm">
                        <strong>Representative:</strong>{" "}
                        {community.representative}
                      </p>
                    </div>
                    <div
                      className={`verida-status-badge ${
                        community.verified
                          ? "verida-status-success"
                          : "verida-status-pending"
                      }`}
                    >
                      {community.verified ? "Verified" : "Pending"}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-verida-dark-teal">
                        {community.totalDonations}
                      </div>
                      <div className="text-xs text-verida-dark-teal/70">
                        Donations
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-verida-dark-teal">
                        {community.totalDeliveries}
                      </div>
                      <div className="text-xs text-verida-dark-teal/70">
                        Deliveries
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-verida-dark-teal">
                        {community.successRate}%
                      </div>
                      <div className="text-xs text-verida-dark-teal/70">
                        Success
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-verida-light-green/30">
                    <span className="text-xs text-verida-dark-teal/60">
                      ID: {community.id}
                    </span>
                    <button
                      onClick={() => setSelectedCommunity(community)}
                      className="verida-button-secondary px-4 py-2 text-sm flex items-center"
                    >
                      <IoEye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Community Needs Section */}
          {selectedCommunity && (
            <div className="mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-verida-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {selectedCommunity.name} Needs
                  </h3>
                  <button
                    onClick={() => setShowNeedForm(!showNeedForm)}
                    className="verida-button-primary flex items-center px-4 py-2"
                  >
                    <IoAdd className="mr-2" />
                    {showNeedForm ? "Cancel" : "Add Need"}
                  </button>
                </div>

                {/* Add Need Form */}
                {showNeedForm && (
                  <div className="mb-6 p-4 bg-white/5 rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white font-medium mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={newNeed.title}
                          onChange={(e) =>
                            setNewNeed({ ...newNeed, title: e.target.value })
                          }
                          placeholder="Need title"
                          className="verida-input"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">
                          Description
                        </label>
                        <textarea
                          value={newNeed.description}
                          onChange={(e) =>
                            setNewNeed({
                              ...newNeed,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe the need in detail"
                          className="verida-input min-h-[80px] resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">
                          Priority
                        </label>
                        <select
                          value={newNeed.priority}
                          onChange={(e) =>
                            setNewNeed({
                              ...newNeed,
                              priority: e.target.value as Need["priority"],
                            })
                          }
                          className="verida-input"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={handleAddNeed}
                          className="verida-button-primary flex items-center px-6 py-2"
                        >
                          <IoCheckmark className="mr-2" />
                          Add
                        </button>
                        <button
                          onClick={() => setShowNeedForm(false)}
                          className="verida-button-outline px-6 py-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Needs List */}
                <div className="space-y-4">
                  {needs.length === 0 ? (
                    <div className="text-center py-8">
                      <FaBullhorn className="text-4xl text-verida-light-green/30 mx-auto mb-4" />
                      <p className="text-white">No registered needs</p>
                      <p className="text-verida-light-green/70 text-sm">
                        Add the community's needs
                      </p>
                    </div>
                  ) : (
                    needs.map((need) => (
                      <div key={need.id} className="bg-white/5 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold text-white">
                            {need.title}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                              need.priority
                            )}`}
                          >
                            {getPriorityText(need.priority)}
                          </span>
                        </div>
                        <p className="text-verida-light-green/80 mb-2">
                          {need.description}
                        </p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-verida-light-green/60">
                            Created:{" "}
                            {new Date(need.created_at).toLocaleDateString()}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              need.status === "active"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-gray-500/20 text-gray-300"
                            }`}
                          >
                            {need.status === "active" ? "Active" : "Fulfilled"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Communities;
