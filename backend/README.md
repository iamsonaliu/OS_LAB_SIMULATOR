# Backend API Documentation

FastAPI-based RESTful API for OS Algorithms Simulator.

## 📋 Overview

The backend provides a robust, well-structured API for simulating Operating System algorithms. It follows RESTful principles and includes comprehensive error handling, validation, and documentation.

## 🏗️ Architecture

```
app/
├── main.py              # FastAPI application entry point
├── config.py            # Application configuration
├── algorithms/          # Core algorithm implementations
│   ├── cpu_scheduling/  # CPU scheduling algorithms
│   ├── disk_scheduling/ # Disk scheduling algorithms
│   └── page_replacement/# Page replacement algorithms
├── models/              # Pydantic models for validation
│   ├── requests.py      # Request models
│   └── responses.py     # Response models
├── routers/             # API route handlers
│   ├── cpu.py          # CPU scheduling endpoints
│   ├── disk.py         # Disk scheduling endpoints
│   └── page.py         # Page replacement endpoints
├── services/            # Business logic layer
│   ├── cpu_service.py   # CPU scheduling service
│   ├── disk_service.py  # Disk scheduling service
│   └── page_service.py  # Page replacement service
└── utils/               # Utility functions
    └── visualization.py # Chart generation utilities
```

## 🚀 Getting Started

### Prerequisites

- Python 3.13 or higher
- pip (Python package manager)

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Activate virtual environment:**
   ```bash
   # Windows
   env\Scripts\activate
   
   # Linux/Mac
   source env/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the development server:**
   ```bash
   uvicorn app.main:app --reload
   ```

5. **Access the API:**
   - API Base URL: http://127.0.0.1:8000
   - Interactive API Docs: http://127.0.0.1:8000/docs
   - Alternative Docs: http://127.0.0.1:8000/redoc
   - Health Check: http://127.0.0.1:8000/health

## 📡 API Endpoints

### Health Check

```http
GET /health
```

Returns API health status and available algorithms.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "algorithms": {
    "cpu": ["FCFS", "SJF", "SRTF", "Priority", "RoundRobin"],
    "page": ["FIFO", "LRU", "Optimal", "LFU"],
    "disk": ["FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK", "C-LOOK"]
  }
}
```

### CPU Scheduling

```http
POST /api/v1/simulate/cpu
```

Simulate CPU scheduling algorithms.

**Request Body:**
```json
{
  "algorithm": "FCFS",
  "processes": [
    {"pid": 1, "arrival_time": 0, "burst_time": 5, "priority": 0},
    {"pid": 2, "arrival_time": 1, "burst_time": 3, "priority": 0}
  ],
  "time_quantum": 2
}
```

**Response:**
```json
{
  "success": true,
  "algorithm": "FCFS",
  "results": {
    "gantt_chart": [...],
    "processes": [...],
    "metrics": {
      "average_waiting_time": 2.5,
      "average_turnaround_time": 5.0
    }
  }
}
```

### Page Replacement

```http
POST /api/v1/simulate/page
```

Simulate page replacement algorithms.

**Request Body:**
```json
{
  "algorithm": "FIFO",
  "page_sequence": [7, 0, 1, 2, 0, 3, 0, 4],
  "frame_count": 3
}
```

### Disk Scheduling

```http
POST /api/v1/simulate/disk
```

Simulate disk scheduling algorithms.

**Request Body:**
```json
{
  "algorithm": "FCFS",
  "request_queue": [98, 183, 37, 122, 14, 124, 65, 67],
  "initial_head": 53,
  "disk_size": 200,
  "direction": "right"
}
```

## 🧪 Testing

Run tests using pytest:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_cpu.py
```

Test files are located in the `tests/` directory:
- `test_cpu.py` - CPU scheduling algorithm tests
- `test_disk.py` - Disk scheduling algorithm tests
- `test_page.py` - Page replacement algorithm tests

## 📦 Dependencies

Key dependencies (see `requirements.txt` for complete list):

- **fastapi** - Web framework
- **uvicorn** - ASGI server
- **pydantic** - Data validation
- **matplotlib** - Visualization
- **pytest** - Testing framework

## 🔧 Configuration

Configuration is managed through `app/config.py`:

- `app_name` - Application name
- `app_version` - Version number
- `cors_origins` - Allowed CORS origins
- `api_prefix` - API route prefix
- `debug` - Debug mode flag

## 🏛️ Code Structure

### Models (`app/models/`)

- **requests.py**: Request validation models using Pydantic
- **responses.py**: Response models for consistent API responses

### Routers (`app/routers/`)

- Handle HTTP requests
- Validate input using Pydantic models
- Call appropriate services
- Return formatted responses

### Services (`app/services/`)

- Business logic layer
- Coordinate between routers and algorithms
- Transform data for responses
- Handle algorithm-specific logic

### Algorithms (`app/algorithms/`)

- Core algorithm implementations
- Pure algorithm logic (no HTTP concerns)
- Return structured results

## 🐛 Error Handling

The API includes comprehensive error handling:

- **Validation Errors**: 422 status with detailed field errors
- **Algorithm Errors**: 400 status with descriptive messages
- **Server Errors**: 500 status (detailed in debug mode)

## 📊 Response Format

All API responses follow a consistent format:

```json
{
  "success": true/false,
  "algorithm": "algorithm_name",
  "results": { ... },
  "error": "error_message" // only if success is false
}
```

## 🔒 CORS

CORS is configured to allow requests from:
- `http://localhost:3000` (development)
- `http://127.0.0.1:3000` (development)

Modify `app/config.py` to add additional origins.

## 📝 Development Notes

- Use type hints throughout the codebase
- Follow PEP 8 style guidelines
- Write docstrings for all functions
- Keep algorithms pure (no side effects)
- Use Pydantic models for all data validation

## 🚀 Production Deployment

For production deployment:

1. Set `debug=False` in configuration
2. Use a production ASGI server (e.g., Gunicorn with Uvicorn workers)
3. Configure proper CORS origins
4. Set up environment variables for sensitive data
5. Use a reverse proxy (nginx) for static files and load balancing

---

For detailed API documentation, visit http://127.0.0.1:8000/docs when the server is running.

