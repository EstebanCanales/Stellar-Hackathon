interface CommunityHeaderProps {
  communityName: string;
  representative: string;
}

const CommunityHeader: React.FC<CommunityHeaderProps> = ({ communityName, representative }) => {
  return (
    <div className="bg-green-500 rounded-2xl p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{communityName}</h2>
      <p className="text-gray-800">Representante: {representative}</p>
    </div>
  );
};

export default CommunityHeader;