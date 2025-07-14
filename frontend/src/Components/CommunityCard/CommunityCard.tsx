import ActionButtons from '../ActionButtons/ActionButtons';
interface CommunityCardProps {
  title: string;
  status: 'validated' | 'pending';
  date?: string;
  imageUrl?: string;
  onViewLink?: () => void;
}


const CommunityCard: React.FC<CommunityCardProps> = ({ 
  title, 
  status, 
  date, 
  imageUrl, 
  onViewLink 
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {status === 'validated' && (
          <span className="text-sm text-gray-600">Hoy</span>
        )}
      </div>
      
      {status === 'validated' && (
        <>
          <p className="text-sm text-gray-600 mb-3">Validada</p>
          
          {imageUrl && (
            <div className="mb-3">
              <img 
                src={imageUrl} 
                alt="Delivery box" 
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{date}</span>
            <button 
              onClick={onViewLink}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Ver enlace
            </button>
          </div>
        </>
      )}
      
      {status === 'pending' && (
        <ActionButtons 
          onVerify={() => console.log('Verificar')} 
          onConfirm={() => console.log('Confirmar')} 
        />
      )}
    </div>
  );
};

export default CommunityCard;