import { useState } from 'react';
import Header from './components/Layout/Header';
import TabNavigation from './components/Layout/TabNavigation';
import CPUSimulator from './components/CPU/CPUSimulator';
import PageSimulator from './components/Page/PageSimulator';
import DiskSimulator from './components/Disk/DiskSimulator';

function App() {
  const [activeTab, setActiveTab] = useState('cpu');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="pb-12">
        {activeTab === 'cpu' && <CPUSimulator />}
        {activeTab === 'page' && <PageSimulator />}
        {activeTab === 'disk' && <DiskSimulator />}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Operating System Algorithms Simulator - Educational Project</p>
            <p className="mt-1">Built with React, TailwindCSS, and FastAPI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;