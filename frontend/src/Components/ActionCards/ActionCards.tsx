interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
}


const ActionCard: React.FC<ActionCardProps> = ({ icon, title, subtitle, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-green-200 rounded-2xl p-6 cursor-pointer hover:bg-green-300 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-700">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default ActionCard;