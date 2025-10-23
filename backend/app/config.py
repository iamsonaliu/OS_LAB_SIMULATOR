from typing import List

class Settings:
    """Simple settings without pydantic-settings"""
    
    # API Info
    app_name: str = "OS Algorithms Simulator API"
    app_version: str = "2.0.0"
    app_description: str = "REST API for CPU, Page, and Disk Scheduling Simulations"
    
    # CORS
    cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000"
    ]
    
    # API Configuration
    api_prefix: str = "/api"
    debug: bool = False

def get_settings() -> Settings:
    """Get settings instance"""
    return Settings()