interface ActionButtonsProps {
  onVerify: () => void;
  onConfirm: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onVerify, onConfirm }) => {
  return (
    <div className="flex gap-3 mt-3">
      <button 
        onClick={onVerify}
        className="flex-1 bg-green-300 hover:bg-green-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Verificar
      </button>
      <button 
        onClick={onConfirm}
        className="flex-1 bg-green-800 hover:bg-green-900 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Confirmar
      </button>
    </div>
  );
};

export default ActionButtons;