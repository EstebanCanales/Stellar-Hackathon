import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";

interface TransactionItemProps {
  type: 'received' | 'sent';
  amount: number;
  date: string;
  from?: string;
  to?: string;
  memo?: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ 
  type, 
  amount, 
  date, 
  from, 
  to, 
  memo 
}) => {
  return (
    <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
            type === 'received' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {type === 'received' ? (
              <FaArrowUp className="w-4 h-4 text-green-600" />
            ) : (
              <FaArrowDown className="w-4 h-4 text-red-600" />
            )}
          </div>
          <div>
            <span className="font-semibold text-gray-900">
              {type === 'received' ? 'Recibido' : 'Enviado'}
            </span>
            <div className="text-sm text-gray-600">{date}</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`font-semibold ${
            type === 'received' ? 'text-green-600' : 'text-red-600'
          }`}>
            {type === 'received' ? '+' : '-'}{amount.toFixed(2)} XLM
          </div>
        </div>
      </div>
      
      {(from || to) && (
        <div className="text-xs text-gray-500 mt-2">
          {type === 'received' ? `De: ${from}` : `Para: ${to}`}
        </div>
      )}
      
      {memo && (
        <div className="text-xs text-gray-500 mt-1">
          Memo: {memo}
        </div>
      )}
    </div>
  );
};

export default TransactionItem;