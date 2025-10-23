from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError
from contextlib import asynccontextmanager  # ✅ Add this
from app.routers import cpu, page, disk
from app.config import get_settings
from app.models.responses import ErrorResponse, HealthResponse
import time

settings = get_settings()

# ✅ Lifespan context manager (replaces on_event)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print(f"🚀 {settings.app_name} v{settings.app_version} starting...")
    print(f"📚 Documentation available at: /docs")
    print(f"🏥 Health check at: /health")
    yield
    # Shutdown
    print(f"👋 {settings.app_name} shutting down...")

# Initialize FastAPI app with lifespan
app = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan  # ✅ Add lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add processing time to response headers"""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Exception handlers (see above for full code)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": "Validation Error",
            "detail": [
                {
                    "loc": err.get("loc", []),
                    "msg": err.get("msg", ""),
                    "type": err.get("type", "")
                }
                for err in exc.errors()
            ]
        }
    )

@app.exception_handler(ValidationError)
async def pydantic_validation_exception_handler(request: Request, exc: ValidationError):
    """Handle Pydantic validation errors"""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": "Validation Error",
            "detail": [
                {
                    "loc": err.get("loc", []),
                    "msg": err.get("msg", ""),
                    "type": err.get("type", "")
                }
                for err in exc.errors()
            ]
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Internal Server Error",
            "detail": str(exc) if settings.debug else "An unexpected error occurred"
        }
    )

# Include routers
app.include_router(
    cpu.router,
    prefix=f"{settings.api_prefix}/simulate/cpu",
    tags=["CPU Scheduling"]
)
app.include_router(
    page.router,
    prefix=f"{settings.api_prefix}/simulate/page",
    tags=["Page Replacement"]
)
app.include_router(
    disk.router,
    prefix=f"{settings.api_prefix}/simulate/disk",
    tags=["Disk Scheduling"]
)

# Root endpoint
@app.get("/", include_in_schema=False)
async def root():
    """Root endpoint - redirect to docs"""
    return {
        "message": "OS Algorithms Simulator API",
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/health"
    }

# Health check
@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["System"],
    summary="Health Check"
)
async def health_check():
    """Check API health status"""
    return HealthResponse(
        status="healthy",
        version=settings.app_version,
        algorithms={
            "cpu": ["FCFS", "SJF", "SRTF", "Priority", "RoundRobin"],
            "page": ["FIFO", "LRU", "Optimal", "LFU"],
            "disk": ["FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK", "C-LOOK"]
        }
    )
