import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Running simulation...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="relative">
        <Loader2 className="w-16 h-16 text-primary-600 dark:text-primary-400 animate-spin" />
        <div className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-800 animate-pulse"></div>
      </div>
      <p className="mt-6 text-lg text-gray-700 dark:text-gray-300 font-medium animate-pulse">
        {message}
      </p>
      <div className="mt-4 flex space-x-2">
        <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}
