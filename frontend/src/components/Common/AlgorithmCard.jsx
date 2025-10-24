export default function AlgorithmCard({ name, description, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        p-4 rounded-lg border-2 text-left transition-all
        ${selected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
        }
      `}
    >
      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
        {name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </button>
  );
}