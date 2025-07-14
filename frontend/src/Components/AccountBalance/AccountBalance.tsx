interface AccountBalanceProps {
  xlmBalance: number;
  usdValue: number;
}

const AccountBalance: React.FC<AccountBalanceProps> = ({ xlmBalance, usdValue }) => {
  return (
    <div className="bg-green-500 rounded-2xl p-6 mb-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
            <span className="text-green-900 font-bold text-lg">✦</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Balance Stellar</h2>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {xlmBalance.toFixed(2)} XLM
        </div>
        <div className="text-lg text-gray-800">
          ≈ ${usdValue.toFixed(2)} USD
        </div>
      </div>
    </div>
  );
};

export default AccountBalance;