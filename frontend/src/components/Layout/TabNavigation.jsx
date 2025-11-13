import { Cpu, FileText, HardDrive } from 'lucide-react';

export default function TabNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { 
      id: 'cpu', 
      name: 'CPU Scheduling', 
      icon: Cpu, 
      getActiveClasses: (isActive) => isActive 
        ? 'text-blue-600 dark:text-blue-400 border-blue-500' 
        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
      getIconClasses: (isActive) => isActive ? 'text-blue-600 dark:text-blue-400' : '',
      bgColor: 'bg-blue-500'
    },
    { 
      id: 'page', 
      name: 'Page Replacement', 
      icon: FileText, 
      getActiveClasses: (isActive) => isActive 
        ? 'text-green-600 dark:text-green-400 border-green-500' 
        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
      getIconClasses: (isActive) => isActive ? 'text-green-600 dark:text-green-400' : '',
      bgColor: 'bg-green-500'
    },
    { 
      id: 'disk', 
      name: 'Disk Scheduling', 
      icon: HardDrive, 
      getActiveClasses: (isActive) => isActive 
        ? 'text-purple-600 dark:text-purple-400 border-purple-500' 
        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
      getIconClasses: (isActive) => isActive ? 'text-purple-600 dark:text-purple-400' : '',
      bgColor: 'bg-purple-500'
    },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center space-x-2 py-4 px-6 font-medium text-sm transition-all duration-200
                  ${tab.getActiveClasses(isActive)}
                `}
                style={{
                  borderBottomWidth: isActive ? '3px' : '0px',
                  borderBottomStyle: 'solid',
                }}
              >
                {isActive && (
                  <div className={`absolute inset-0 ${tab.bgColor} opacity-5 rounded-t-xl`} />
                )}
                <Icon className={`w-5 h-5 ${tab.getIconClasses(isActive)}`} />
                <span className="relative z-10">{tab.name}</span>
                {isActive && (
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${tab.bgColor} rounded-t-full`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
