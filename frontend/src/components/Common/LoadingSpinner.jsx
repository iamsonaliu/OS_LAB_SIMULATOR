import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Running simulation...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
        {message}
      </p>
    </div>
  );
}