import React, { useState, useEffect } from "react";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoTime,
  IoEye,
  IoStatsChart,
  IoCheckmark,
  IoClose,
} from "react-icons/io5";
import {
  FaBoxOpen,
  FaClipboardCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import Header from "../../Components/Header/Header";

interface Delivery {
  id: string;
  community_name: string;
  goods_received: string;
  quantity: string;
  representative_id: string;
  status: "pending" | "validated" | "rejected";
  created_at: string;
  notes?: string;
}

const Deliverys: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [filter, setFilter] = useState<
    "all" | "pending" | "validated" | "rejected"
  >("all");
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [validationNotes, setValidationNotes] = useState("");
  const [loading, setLoading] = useState(true);

  // Example data
  useEffect(() => {
    const mockDeliveries: Delivery[] = [
      {
        id: "1",
        community_name: "San José Community",
        goods_received: "Basic food and medicine",
        quantity: "50 packages",
        representative_id: "REP-001",
        status: "pending",
        created_at: "2024-01-15",
        notes: "Delivery scheduled for tomorrow",
      },
      {
        id: "2",
        community_name: "Nueva Esperanza Village",
        goods_received: "Construction materials",
        quantity: "20 cement bags",
        representative_id: "REP-002",
        status: "validated",
        created_at: "2024-01-14",
        notes: "Delivery completed successfully",
      },
      {
        id: "3",
        community_name: "El Progreso Neighborhood",
        goods_received: "School supplies",
        quantity: "100 kits",
        representative_id: "REP-003",
        status: "rejected",
        created_at: "2024-01-13",
        notes: "Delivery not completed according to conditions",
      },
    ];

    setTimeout(() => {
      setDeliveries(mockDeliveries);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDeliveries = deliveries.filter(
    (delivery) => filter === "all" || delivery.status === filter
  );

  const stats = {
    total: deliveries.length,
    pending: deliveries.filter((d) => d.status === "pending").length,
    validated: deliveries.filter((d) => d.status === "validated").length,
    rejected: deliveries.filter((d) => d.status === "rejected").length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "validated":
        return <IoCheckmarkCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <IoCloseCircle className="w-5 h-5 text-red-600" />;
      default:
        return <IoTime className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "validated":
        return "Validated";
      case "rejected":
        return "Rejected";
      default:
        return "Pending";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "validated":
        return "verida-status-success";
      case "rejected":
        return "verida-status-error";
      default:
        return "verida-status-pending";
    }
  };

  const handleValidateDelivery = (action: "validate" | "reject") => {
    if (!selectedDelivery) return;

    const updatedDeliveries = deliveries.map((delivery) =>
      delivery.id === selectedDelivery.id
        ? {
            ...delivery,
            status: action === "validate" ? "validated" : "rejected",
            notes: validationNotes,
          }
        : delivery
    );

    setDeliveries(updatedDeliveries as Delivery[]);
    setShowModal(false);
    setSelectedDelivery(null);
    setValidationNotes("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <div className="verida-container pt-6">
          <Header />
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="verida-spinner mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading deliveries...</p>
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
              <FaClipboardCheck className="inline-block mr-3 text-verida-light-green" />
              Validate Deliveries
            </h1>
            <p className="text-lg text-verida-light-green/80 verida-animate-fadeIn">
              Validate deliveries made to communities
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 px-4">
          <div className="verida-grid verida-grid-4 gap-4 max-w-4xl mx-auto">
            <div className="verida-card p-6 text-center">
              <IoStatsChart className="text-3xl text-verida-dark-teal mb-3 mx-auto" />
              <div className="text-2xl font-bold text-verida-dark-teal">
                {stats.total}
              </div>
              <div className="text-sm text-verida-dark-teal/70">Total</div>
            </div>
            <div className="verida-card p-6 text-center">
              <IoTime className="text-3xl text-yellow-600 mb-3 mx-auto" />
              <div className="text-2xl font-bold text-verida-dark-teal">
                {stats.pending}
              </div>
              <div className="text-sm text-verida-dark-teal/70">Pending</div>
            </div>
            <div className="verida-card p-6 text-center">
              <IoCheckmarkCircle className="text-3xl text-green-600 mb-3 mx-auto" />
              <div className="text-2xl font-bold text-verida-dark-teal">
                {stats.validated}
              </div>
              <div className="text-sm text-verida-dark-teal/70">Validated</div>
            </div>
            <div className="verida-card p-6 text-center">
              <IoCloseCircle className="text-3xl text-red-600 mb-3 mx-auto" />
              <div className="text-2xl font-bold text-verida-dark-teal">
                {stats.rejected}
              </div>
              <div className="text-sm text-verida-dark-teal/70">Rejected</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 px-4">
          <div className="flex flex-wrap gap-4 justify-center max-w-lg mx-auto">
            {[
              { value: "all", label: "All" },
              { value: "pending", label: "Pending" },
              { value: "validated", label: "Validated" },
              { value: "rejected", label: "Rejected" },
            ].map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value as typeof filter)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  filter === filterOption.value
                    ? "verida-button-primary"
                    : "verida-button-outline"
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Deliveries List */}
        <div className="px-4 pb-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Deliveries to Validate
          </h2>

          {filteredDeliveries.length === 0 ? (
            <div className="text-center py-12">
              <FaBoxOpen className="text-6xl text-verida-light-green/30 mx-auto mb-4" />
              <p className="text-white text-lg mb-2">
                No deliveries{" "}
                {filter !== "all"
                  ? `${
                      filter === "pending"
                        ? "pending"
                        : filter === "validated"
                        ? "validated"
                        : "rejected"
                    }`
                  : ""}
              </p>
              <p className="text-verida-light-green/70">
                Deliveries will appear here when available
              </p>
            </div>
          ) : (
            <div className="verida-grid verida-grid-1 lg:verida-grid-2 gap-6 max-w-6xl mx-auto">
              {filteredDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="verida-card p-6 verida-animate-slideIn"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-verida-dark-teal mb-2">
                        {delivery.community_name}
                      </h3>
                      <p className="text-verida-dark-teal/80 mb-2">
                        <strong>Goods:</strong> {delivery.goods_received}
                      </p>
                      <p className="text-verida-dark-teal/80 mb-2">
                        <strong>Quantity:</strong> {delivery.quantity}
                      </p>
                      <p className="text-verida-dark-teal/80">
                        <strong>Representative:</strong>{" "}
                        {delivery.representative_id}
                      </p>
                    </div>
                    <div
                      className={`verida-status-badge ${getStatusColor(
                        delivery.status
                      )}`}
                    >
                      {getStatusIcon(delivery.status)}
                      <span className="ml-2">
                        {getStatusText(delivery.status)}
                      </span>
                    </div>
                  </div>

                  {delivery.notes && (
                    <div className="bg-verida-light-green/20 rounded-lg p-3 mb-4">
                      <p className="text-sm text-verida-dark-teal">
                        <strong>Notes:</strong> {delivery.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-verida-light-green/30">
                    <span className="text-xs text-verida-dark-teal/60">
                      {new Date(delivery.created_at).toLocaleDateString()}
                    </span>
                    {delivery.status === "pending" && (
                      <button
                        onClick={() => {
                          setSelectedDelivery(delivery);
                          setShowModal(true);
                        }}
                        className="verida-button-primary px-4 py-2 text-sm flex items-center"
                      >
                        <IoEye className="w-4 h-4 mr-2" />
                        Validate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Validation Modal */}
        {showModal && selectedDelivery && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-verida-lg">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Validate Delivery
              </h2>

              <div className="mb-6 space-y-4">
                <div>
                  <p className="text-white">
                    <strong>Community:</strong>{" "}
                    {selectedDelivery.community_name}
                  </p>
                </div>
                <div>
                  <p className="text-white">
                    <strong>Goods:</strong> {selectedDelivery.goods_received}
                  </p>
                </div>
                <div>
                  <p className="text-white">
                    <strong>Quantity:</strong> {selectedDelivery.quantity}
                  </p>
                </div>
                <div>
                  <p className="text-white">
                    <strong>Representative:</strong>{" "}
                    {selectedDelivery.representative_id}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-white font-medium mb-2">
                  Validation notes
                </label>
                <textarea
                  value={validationNotes}
                  onChange={(e) => setValidationNotes(e.target.value)}
                  placeholder="Add comments about the validation..."
                  className="verida-input min-h-[100px] resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleValidateDelivery("validate")}
                  className="verida-button-primary flex items-center justify-center px-6 py-3"
                >
                  <IoCheckmark className="mr-2" />
                  Validate Delivery
                </button>
                <button
                  onClick={() => handleValidateDelivery("reject")}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <IoClose className="mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="verida-button-outline px-6 py-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deliverys;
