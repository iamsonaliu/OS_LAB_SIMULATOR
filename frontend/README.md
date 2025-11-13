# Frontend Application Documentation

Modern React-based frontend for OS Algorithms Simulator.

## 📋 Overview

A responsive, interactive web application built with React 19 and Vite, providing an intuitive interface for simulating and visualizing Operating System algorithms.

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── CPU/            # CPU scheduling components
│   │   ├── CPUSimulator.jsx
│   │   ├── ProcessForm.jsx
│   │   └── CPUResults.jsx
│   ├── Page/           # Page replacement components
│   │   ├── PageSimulator.jsx
│   │   ├── PageForm.jsx
│   │   └── PageResults.jsx
│   ├── Disk/           # Disk scheduling components
│   │   ├── DiskSimulator.jsx
│   │   ├── DiskForm.jsx
│   │   └── DiskResults.jsx
│   ├── Charts/         # Chart components
│   │   ├── GanttChart.jsx
│   │   ├── ComparisonChart.jsx
│   │   ├── DiskMovementChart.jsx
│   │   └── PageReplacementChart.jsx
│   ├── Common/         # Shared components
│   │   ├── AlgorithmCard.jsx
│   │   ├── ComparisonMode.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── MetricsCard.jsx
│   └── Layout/         # Layout components
│       ├── Header.jsx
│       └── TabNavigation.jsx
├── services/           # API service layer
│   └── api.js          # Axios-based API client
├── hooks/              # Custom React hooks
│   └── useDarkMode.js  # Dark mode hook
├── utils/              # Utility functions
│   └── helpers.js      # Helper functions
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Features

### User Interface

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Toggle between light and dark themes
- **Tab Navigation**: Easy switching between algorithm types
- **Interactive Forms**: Dynamic input for processes, pages, and disk requests
- **Real-time Results**: Instant visualization after simulation

### Visualizations

- **Gantt Charts**: Visual representation of CPU scheduling
- **Comparison Charts**: Side-by-side algorithm comparison
- **Disk Movement Charts**: Visual disk head movement
- **Page Replacement Tables**: Step-by-step page replacement visualization

### Functionality

- **Algorithm Selection**: Choose from multiple algorithms
- **Comparison Mode**: Compare multiple algorithms simultaneously
- **Export Results**: Download simulation results
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during API calls

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Charting library for visualizations
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library

## 📡 API Integration

The frontend communicates with the backend API through the service layer:

### API Service (`src/services/api.js`)

```javascript
import { cpuAPI, pageAPI, diskAPI } from './services/api';

// CPU Scheduling
const result = await cpuAPI.simulate({
  algorithm: 'FCFS',
  processes: [...],
  time_quantum: 2
});

// Page Replacement
const result = await pageAPI.simulate({
  algorithm: 'FIFO',
  page_sequence: [7, 0, 1, 2],
  frame_count: 3
});

// Disk Scheduling
const result = await diskAPI.simulate({
  algorithm: 'FCFS',
  request_queue: [98, 183, 37],
  initial_head: 53,
  disk_size: 200
});
```

### API Configuration

The API base URL is configured in `src/services/api.js`. By default, it points to:
- Development: `http://127.0.0.1:8000`

## 🎯 Component Architecture

### Simulator Components

Each algorithm type has a dedicated simulator component:
- `CPUSimulator.jsx` - CPU scheduling interface
- `PageSimulator.jsx` - Page replacement interface
- `DiskSimulator.jsx` - Disk scheduling interface

### Form Components

Input forms for each algorithm type:
- `ProcessForm.jsx` - CPU process input
- `PageForm.jsx` - Page sequence input
- `DiskForm.jsx` - Disk request input

### Result Components

Display components for simulation results:
- `CPUResults.jsx` - CPU scheduling results with Gantt chart
- `PageResults.jsx` - Page replacement results with table
- `DiskResults.jsx` - Disk scheduling results with movement chart

### Common Components

Reusable components used across the application:
- `AlgorithmCard.jsx` - Algorithm selection cards
- `ComparisonMode.jsx` - Algorithm comparison interface
- `LoadingSpinner.jsx` - Loading indicator
- `MetricsCard.jsx` - Metrics display cards

## 🎨 Styling

The application uses Tailwind CSS for styling:

- **Utility Classes**: Rapid UI development
- **Dark Mode**: Automatic theme switching
- **Responsive**: Mobile-first design approach
- **Custom Animations**: Smooth transitions and effects

### Custom CSS

Global styles and custom animations are defined in `src/index.css`.

## 🔧 State Management

The application uses React hooks for state management:

- **useState**: Local component state
- **Custom Hooks**: Reusable state logic (e.g., `useDarkMode`)

### State Flow

```
User Input → Form Component → API Call → Results Component → Visualization
```

## 📱 Responsive Design

The application is fully responsive:

- **Desktop**: Full-featured layout with side-by-side comparisons
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Stacked layout for small screens

## 🌙 Dark Mode

Dark mode is implemented using:

- Tailwind's dark mode classes
- Local storage persistence
- System preference detection
- Smooth theme transitions

Toggle dark mode using the button in the header.

## 🧪 Development

### Adding New Algorithms

1. Add algorithm to backend API
2. Update `api.js` service if needed
3. Add algorithm option to form component
4. Update result display component if needed

### Adding New Visualizations

1. Create chart component in `components/Charts/`
2. Import Recharts components
3. Style with Tailwind CSS
4. Integrate into results component

## 🚀 Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

## 📦 Dependencies

Key dependencies (see `package.json` for complete list):

- **react** - UI library
- **react-dom** - React DOM renderer
- **vite** - Build tool
- **tailwindcss** - CSS framework
- **recharts** - Chart library
- **axios** - HTTP client
- **lucide-react** - Icons

## 🔍 Code Quality

- ESLint configured for code quality
- React best practices followed
- Component reusability emphasized
- Clean code principles applied

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Ensure backend is running on http://127.0.0.1:8000
   - Check CORS configuration in backend

2. **Build Errors**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version (requires 18+)

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check `tailwind.config.js` for custom settings

---

For backend API documentation, see the [Backend README](../backend/README.md).
