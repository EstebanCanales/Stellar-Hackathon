import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEye,
  FaCheck,
  FaHeart,
  FaUsers,
  FaHandshake,
} from "react-icons/fa";
import { FaLocationDot, FaMoneyBillWave, FaCalendar } from "react-icons/fa6";
import Header from "../../Components/Header/Header";
import {
  apiService,
  type Community,
  type Donation,
  type CreateDonationRequest,
} from "../../services/api";

interface DonationFormData {
  communityId: string;
  amount: string;
  description: string;
  conditions: string;
  stellarKey: string;
}

const Donations: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<DonationFormData>({
    communityId: "",
    amount: "",
    description: "",
    conditions: "",
    stellarKey: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [communitiesRes, donationsRes] = await Promise.all([
        apiService.getCommunities(),
        apiService.getDonations(),
      ]);

      setCommunities(communitiesRes.communities);
      setDonations(donationsRes.donations);
    } catch (err) {
      console.error("Error loading data:", err);
      setError(
        "Error loading data. Please verify that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.communityId || !formData.amount || !formData.description) {
      setError("Please fill in all required fields");
      return false;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError("Amount must be a valid number greater than 0");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);

      const donationData: CreateDonationRequest = {
        community_id: formData.communityId,
        amount: parseFloat(formData.amount),
        description: formData.description,
        conditions: formData.conditions || "Delivery verified by community",
        donor_stellar_key: formData.stellarKey || "DEMO_STELLAR_KEY_123456789",
      };

      await apiService.createDonation(donationData);

      setSuccess("Donation created successfully!");
      setFormData({
        communityId: "",
        amount: "",
        description: "",
        conditions: "",
        stellarKey: "",
      });
      setShowForm(false);

      // Reload donations
      loadData();
    } catch (err) {
      console.error("Error creating donation:", err);
      setError("Error creating donation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Created":
        return "verida-status-info";
      case "InEscrow":
        return "verida-status-pending";
      case "Validated":
        return "verida-status-pending";
      case "Delivered":
        return "verida-status-pending";
      case "Completed":
        return "verida-status-success";
      case "Disputed":
        return "verida-status-error";
      case "Cancelled":
        return "verida-status-error";
      default:
        return "verida-status-info";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Created":
        return "Created";
      case "InEscrow":
        return "In Escrow";
      case "Validated":
        return "Validated";
      case "Delivered":
        return "Delivered";
      case "Completed":
        return "Completed";
      case "Disputed":
        return "Disputed";
      case "Cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <div className="verida-container pt-6">
          <Header />
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="verida-spinner mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading donations...</p>
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
              <FaHeart className="inline-block mr-3 text-verida-light-green" />
              Donation System
            </h1>
            <p className="text-lg text-verida-light-green/80 verida-animate-fadeIn">
              Manage transparent donations using Stellar blockchain
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 px-4">
            <div className="bg-error/20 border border-error/30 text-white p-4 rounded-lg max-w-2xl mx-auto verida-animate-slideIn">
              <div className="flex items-center">
                <span className="text-lg mr-2">⚠️</span>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 px-4">
            <div className="bg-verida-green/20 border border-verida-green/30 text-white p-4 rounded-lg max-w-2xl mx-auto verida-animate-slideIn">
              <div className="flex items-center">
                <FaCheck className="text-verida-light-green text-lg mr-2" />
                <p>{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="mb-8 px-4">
          <div className="verida-grid verida-grid-3 gap-4 max-w-4xl mx-auto">
            <div className="verida-card p-6 text-center">
              <FaMoneyBillWave className="text-3xl text-verida-dark-teal mb-3 mx-auto" />
              <div className="text-2xl font-bold text-verida-dark-teal">
                {donations.length}
              </div>
              <div className="text-sm text-verida-dark-teal/70">
                Total Donations
              </div>
            </div>
            <div className="verida-card p-6 text-center">
              <FaUsers className="text-3xl text-verida-dark-teal mb-3 mx-auto" />
              <div className="text-2xl font-bold text-verida-dark-teal">
                {communities.length}
              </div>
              <div className="text-sm text-verida-dark-teal/70">
                Active Communities
              </div>
            </div>
            <div className="verida-card p-6 text-center">
              <FaHandshake className="text-3xl text-verida-dark-teal mb-3 mx-auto" />
              <div className="text-2xl font-bold text-verida-dark-teal">
                {donations.filter((d) => d.status === "Completed").length}
              </div>
              <div className="text-sm text-verida-dark-teal/70">Completed</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 px-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <button
              onClick={() => setShowForm(!showForm)}
              className="verida-button-primary flex items-center justify-center px-6 py-3"
            >
              <FaPlus className="mr-2" />
              {showForm ? "Cancel" : "New Donation"}
            </button>
            <button
              onClick={loadData}
              className="verida-button-outline flex items-center justify-center px-6 py-3"
            >
              <FaEye className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 px-4 verida-animate-fadeIn">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-2xl mx-auto shadow-verida-lg">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Create New Donation
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Beneficiary Community *
                  </label>
                  <select
                    name="communityId"
                    value={formData.communityId}
                    onChange={handleInputChange}
                    className="verida-input"
                    required
                  >
                    <option value="">Select a community</option>
                    {communities.map((community) => (
                      <option key={community.id} value={community.id}>
                        {community.name} - {community.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Amount (USD) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Example: 500"
                    className="verida-input"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the purpose of this donation..."
                    className="verida-input min-h-[100px] resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Delivery Conditions
                  </label>
                  <textarea
                    name="conditions"
                    value={formData.conditions}
                    onChange={handleInputChange}
                    placeholder="Specific conditions for delivery (optional)"
                    className="verida-input min-h-[80px] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Stellar Key (optional)
                  </label>
                  <input
                    type="text"
                    name="stellarKey"
                    value={formData.stellarKey}
                    onChange={handleInputChange}
                    placeholder="Your Stellar public key"
                    className="verida-input"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="verida-button-primary flex items-center justify-center px-8 py-3 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="verida-spinner w-5 h-5 mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <FaCheck className="mr-2" />
                        Create Donation
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="verida-button-outline px-8 py-3"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Donations List */}
        <div className="px-4 pb-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Recent Donations
          </h2>

          {donations.length === 0 ? (
            <div className="text-center py-12">
              <FaHeart className="text-6xl text-verida-light-green/30 mx-auto mb-4" />
              <p className="text-white text-lg mb-2">No donations yet</p>
              <p className="text-verida-light-green/70">
                Be the first to create a donation!
              </p>
            </div>
          ) : (
            <div className="verida-grid verida-grid-1 lg:verida-grid-2 gap-6 max-w-6xl mx-auto">
              {donations.map((donation) => {
                const community = communities.find(
                  (c) => c.id === donation.community_id
                );
                return (
                  <div
                    key={donation.id}
                    className="verida-card p-6 verida-animate-slideIn"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-verida-dark-teal mb-2">
                          ${donation.amount.toLocaleString()}
                        </h3>
                        <div className="flex items-center text-verida-dark-teal/70 mb-2">
                          <FaLocationDot className="mr-2" />
                          <span className="text-sm">
                            {community?.name || "Unknown community"}
                          </span>
                        </div>
                        <div className="flex items-center text-verida-dark-teal/70">
                          <FaCalendar className="mr-2" />
                          <span className="text-sm">
                            {new Date(donation.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`verida-status-badge ${getStatusColor(
                          donation.status
                        )}`}
                      >
                        {getStatusText(donation.status)}
                      </div>
                    </div>

                    <p className="text-verida-dark-teal/80 mb-4 leading-relaxed">
                      {donation.description}
                    </p>

                    {donation.conditions && (
                      <div className="bg-verida-light-green/20 rounded-lg p-3 mb-4">
                        <p className="text-sm text-verida-dark-teal">
                          <strong>Conditions:</strong> {donation.conditions}
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-verida-light-green/30">
                      <span className="text-xs text-verida-dark-teal/60">
                        ID: {donation.id.slice(0, 8)}...
                      </span>
                      <button className="verida-button-secondary px-4 py-2 text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donations;
