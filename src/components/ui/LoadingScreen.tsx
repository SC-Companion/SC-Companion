interface LoadingScreenProps {
  message?: string;
  submessage?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "SC Companion", 
  submessage = "Initialisation..." 
}) => {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
        <h2 className="text-2xl font-bold text-primary mb-2">{message}</h2>
        <p className="text-base-content/70">{submessage}</p>
      </div>
    </div>
  );
};