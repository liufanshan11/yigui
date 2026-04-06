import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 40 }) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2
        size={size}
        className="text-indigo-500 animate-spin"
      />
    </div>
  );
};

export default LoadingSpinner;
