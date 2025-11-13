import { Moon, Sun, Github, BookOpen, ActivitySquare } from "lucide-react";
import useDarkMode from "../../hooks/useDarkMode";

export default function Header() {
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-soft dark:shadow-soft-dark sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
              <ActivitySquare className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                OS Algorithms Simulator
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Interactive Learning Platform
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
              aria-label="Toggle dark mode"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Documentation Link */}
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
              aria-label="API Documentation"
              title="API Documentation"
            >
              <BookOpen className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </a>

            {/* GitHub Link */}
            <a
              href="https://github.com/iamsonaliu/OS_LAB_SIMULATOR"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
              aria-label="GitHub Repository"
              title="GitHub Repository"
            >
              <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
