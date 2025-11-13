import { useState } from 'react';
import Header from './components/Layout/Header';
import TabNavigation from './components/Layout/TabNavigation';
import CPUSimulator from './components/CPU/CPUSimulator';
import PageSimulator from './components/Page/PageSimulator';
import DiskSimulator from './components/Disk/DiskSimulator';

function App() {
  const [activeTab, setActiveTab] = useState('cpu');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      <Header />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="pb-12 animate-fade-in">
        {activeTab === 'cpu' && <CPUSimulator />}
        {activeTab === 'page' && <PageSimulator />}
        {activeTab === 'disk' && <DiskSimulator />}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Operating System Algorithms Simulator - Educational Project
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Built with React, TailwindCSS, and FastAPI
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <a
                href="https://github.com/iamsonaliu/OS_LAB_SIMULATOR"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                GitHub
              </a>
              <span className="text-gray-400">•</span>
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                API Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
