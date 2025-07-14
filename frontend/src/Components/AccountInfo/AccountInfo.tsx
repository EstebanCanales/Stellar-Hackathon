import React, { useState } from "react";
interface AccountInfoProps {
  publicKey: string;
  accountId: string;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ publicKey, accountId }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-green-200 rounded-2xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Account Information
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Public Key
          </label>
          <div className="flex items-center bg-white rounded-lg p-3">
            <span className="text-xs text-gray-600 font-mono flex-1 mr-2">
              {publicKey.slice(0, 20)}...{publicKey.slice(-10)}
            </span>
            <button
              onClick={() => copyToClipboard(publicKey, "public")}
              className="text-green-600 hover:text-green-800"
            >
              {copied === "public" ? "✓" : "📋"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account ID
          </label>
          <div className="flex items-center bg-white rounded-lg p-3">
            <span className="text-xs text-gray-600 font-mono flex-1 mr-2">
              {accountId.slice(0, 20)}...{accountId.slice(-10)}
            </span>
            <button
              onClick={() => copyToClipboard(accountId, "account")}
              className="text-green-600 hover:text-green-800"
            >
              {copied === "account" ? "✓" : "📋"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
