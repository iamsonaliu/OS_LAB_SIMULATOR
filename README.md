# 🖥️ OS Algorithms Simulator

A comprehensive, interactive web application for learning and visualizing Operating System algorithms. This full-stack project provides an intuitive interface to simulate, compare, and understand CPU Scheduling, Page Replacement, and Disk Scheduling algorithms with real-time visualizations.

## 📋 Table of Contents

- [Overview](-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Team Contributions](#team-contributions)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)

## 🎯 Overview

This project is a complete OS algorithms learning platform that evolved from a CLI-based simulator to a modern full-stack web application. It allows students and educators to:

- **Simulate** various OS algorithms with custom inputs
- **Visualize** algorithm execution through interactive charts and graphs
- **Compare** multiple algorithms side-by-side
- **Learn** through detailed step-by-step execution traces
- **Export** results for analysis and documentation

## ✨ Features

### CPU Scheduling Algorithms
- **FCFS** (First Come First Serve) - Non-preemptive
- **SJF** (Shortest Job First) - Non-preemptive
- **SRTF** (Shortest Remaining Time First) - Preemptive
- **Priority Scheduling** - Both preemptive and non-preemptive
- **Round Robin** - Time-quantum based scheduling

### Page Replacement Algorithms
- **FIFO** (First In First Out)
- **LRU** (Least Recently Used)
- **Optimal** (Belady's Algorithm)
- **LFU** (Least Frequently Used)

### Disk Scheduling Algorithms
- **FCFS** (First Come First Serve)
- **SSTF** (Shortest Seek Time First)
- **SCAN** (Elevator Algorithm)
- **C-SCAN** (Circular SCAN)
- **LOOK** (Modified SCAN)
- **C-LOOK** (Circular LOOK)

### Additional Features
- 🎨 Modern, responsive UI with dark mode support
- 📊 Interactive Gantt charts for CPU scheduling
- 📈 Real-time algorithm comparison
- 🔄 Step-by-step execution visualization
- 📥 Export results functionality
- 🎯 Detailed metrics and statistics
- 🌐 RESTful API with comprehensive documentation

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **Python 3.13+** - Core programming language
- **Pydantic** - Data validation and settings management
- **Uvicorn** - ASGI server
- **Matplotlib/Seaborn** - Visualization generation
- **Pytest** - Testing framework

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Charting library
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 📂 Project Structure

```
os-simulator/
│
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── algorithms/      # Algorithm implementations
│   │   │   ├── cpu_scheduling/
│   │   │   ├── disk_scheduling/
│   │   │   └── page_replacement/
│   │   ├── models/          # Pydantic models
│   │   ├── routers/         # API route handlers
│   │   ├── services/        # Business logic layer
│   │   └── utils/           # Utility functions
│   ├── tests/               # Unit and integration tests
│   ├── requirements.txt     # Python dependencies
│   └── README.md            # Backend documentation
│
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── CPU/         # CPU scheduling components
│   │   │   ├── Page/        # Page replacement components
│   │   │   ├── Disk/        # Disk scheduling components
│   │   │   ├── Charts/      # Chart components
│   │   │   ├── Common/      # Shared components
│   │   │   └── Layout/      # Layout components
│   │   ├── services/        # API service layer
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   ├── package.json         # Node dependencies
│   └── README.md            # Frontend documentation
│
├── legacy/                  # Original CLI-based implementation
│   ├── cpu_scheduling/
│   ├── disk_scheduling/
│   └── page_replacement/
│
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.13+** installed
- **Node.js 18+** and npm installed
- **Git** for version control

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Activate the virtual environment:
   ```bash
   # Windows
   env\Scripts\activate
   
   # Linux/Mac
   source env/bin/activate
   ```

3. Install dependencies (if not already installed):
   ```bash
   pip install -r requirements.txt
   ```

4. Start the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

5. The API will be available at:
   - **API**: http://127.0.0.1:8000
   - **Interactive Docs**: http://127.0.0.1:8000/docs
   - **Health Check**: http://127.0.0.1:8000/health

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The application will be available at:
   - **Frontend**: http://localhost:3000

### Running Both Services

For the best experience, run both backend and frontend simultaneously:

1. Open two terminal windows
2. In Terminal 1: Start the backend (follow Backend Setup steps)
3. In Terminal 2: Start the frontend (follow Frontend Setup steps)
4. Open http://localhost:3000 in your browser

## 👥 Team Contributions

This project was developed as a collaborative effort with clear division of responsibilities:

### **Sonali**
**Primary Responsibilities:**
- ✅ **Complete Frontend Development** - Built the entire React application
  - Designed and implemented all UI components
  - Created responsive layouts with Tailwind CSS
  - Implemented dark mode support
  - Built interactive charts and visualizations
  - Developed comparison mode functionality
- ✅ **Backend API Architecture** - Designed and implemented the FastAPI backend
  - Created RESTful API structure
  - Implemented service layer architecture
  - Built request/response models with Pydantic
  - Set up CORS, error handling, and middleware
  - Created comprehensive API documentation
- ✅ **Project Integration** - Connected frontend and backend
  - Implemented API service layer
  - Handled state management
  - Created data flow architecture
- ✅ **CPU Scheduling Algorithms** - Implemented all 5 CPU scheduling algorithms
- ✅ **Project Management** - Overall project coordination and architecture decisions

### **Kunal** 
**Contributions:**
- ✅ Implemented Page Replacement algorithms (FIFO, LRU, Optimal, LFU) and CPU algorithms ( SRTF, Priority, Round Robin)
- ✅ Complete visualization utilities using recharts.
- ✅ Algorithm logic and core functionality
- ✅ Initial algorithm testing and validation
- ✅ Testing of APIs ad overall debugging of the project.

### **Krishna** 
**Contributions:**
- ✅ Implemented Disk Scheduling algorithms (FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK) and CPU algorithms(FCFS, SJF )
- ✅ Complete visualization utilities using matplotlib and seaborn in the legacy part.
- ✅ Algorithm logic and core functionality
- ✅ Initial algorithm testing and validation
- ✅ Testing of APIs ad overall debugging of the project.

### Project Evolution

The project evolved through three phases:
1. **Phase 1** (Legacy): CLI-based simulator with basic visualizations
2. **Phase 2**: API conversion and enhanced visualizations
3. **Phase 3** (Current): Full-stack web application with modern UI

## 🏗️ Architecture

### Backend Architecture

```
Request → Router → Service → Algorithm → Response
           ↓         ↓          ↓
        Validation  Business  Core
                   Logic     Logic
```

- **Routers**: Handle HTTP requests and responses
- **Services**: Business logic and data transformation
- **Algorithms**: Core algorithm implementations
- **Models**: Data validation and serialization
- **Utils**: Visualization and helper functions

### Frontend Architecture

```
App → Tab Navigation → Simulator Components
                        ↓
              Form → API Call → Results Display
                        ↓
              Charts & Visualizations
```

- **Component-based**: Modular React components
- **Service Layer**: Centralized API communication
- **State Management**: React hooks for local state
- **Reusable Components**: Common components for consistency

## 📚 API Documentation

The backend provides comprehensive API documentation:

- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

### Key Endpoints

- `POST /api/v1/simulate/cpu` - CPU scheduling simulation
- `POST /api/v1/simulate/page` - Page replacement simulation
- `POST /api/v1/simulate/disk` - Disk scheduling simulation
- `GET /health` - Health check endpoint

## 🎨 Screenshots


## 📝 License

This project is developed for educational purposes as part of the Operating Systems course (5th Semester PBL).

## 🙏 Acknowledgments

- Team members for their algorithm implementations
- FastAPI and React communities for excellent documentation
- Educational resources on OS algorithms

---

**Note**: This project represents a significant full-stack development effort, combining modern web technologies with core computer science concepts to create an effective learning tool.
