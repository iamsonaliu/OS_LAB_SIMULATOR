from fastapi import APIRouter, HTTPException, status
from app.models.requests import DiskSchedulingRequest
from app.models.responses import DiskSchedulingResponse
from app.services.disk_service import DiskSchedulingService
from typing import Dict, Any  # ✅ Add Any

router = APIRouter()
service = DiskSchedulingService()

@router.post(
    "/",
    response_model=DiskSchedulingResponse,
    status_code=status.HTTP_200_OK,
    summary="Simulate Disk Scheduling",
    description="""
    Simulate disk scheduling algorithms with custom request queues.
    
    **Supported Algorithms:**
    - **FCFS**: First Come First Serve
    - **SSTF**: Shortest Seek Time First
    - **SCAN**: Elevator algorithm (moves to end, then reverses)
    - **C-SCAN**: Circular SCAN (jumps back to start)
    - **LOOK**: Like SCAN but only goes to last request
    - **C-LOOK**: Circular LOOK
    
    **Returns:**
    - Request service sequence
    - Total seek time and metrics
    - Head movement visualization (Base64 PNG)
    """
)
async def simulate_disk_scheduling(request: DiskSchedulingRequest):
    """Execute disk scheduling simulation"""
    try:
        result = service.simulate(request)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Simulation failed: {str(e)}"
        )

@router.get(
    "/algorithms",
    response_model=Dict[str, Any],  # ✅ Changed from Dict[str, any]
    summary="Get Available Algorithms"
)
async def get_algorithms():
    """Get list of available disk scheduling algorithms"""
    return {
        "algorithms": ["FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK", "C-LOOK"],
        "descriptions": {
            "FCFS": {
                "name": "First Come First Serve",
                "description": "Services requests in arrival order",
                "requires_direction": False,
                "advantages": ["Fair", "No starvation"],
                "disadvantages": ["High seek time", "Random access pattern"]
            },
            "SSTF": {
                "name": "Shortest Seek Time First",
                "description": "Services closest request first",
                "requires_direction": False,
                "advantages": ["Better than FCFS", "Reduced seek time"],
                "disadvantages": ["Starvation possible", "Not optimal"]
            },
            "SCAN": {
                "name": "SCAN (Elevator)",
                "description": "Moves to end, then reverses direction",
                "requires_direction": True,
                "advantages": ["Fair", "Predictable"],
                "disadvantages": ["Unnecessary movement to end"]
            },
            "C-SCAN": {
                "name": "Circular SCAN",
                "description": "Returns to start after reaching end",
                "requires_direction": True,
                "advantages": ["More uniform wait time"],
                "disadvantages": ["Longer seek time than SCAN"]
            },
            "LOOK": {
                "name": "LOOK",
                "description": "Like SCAN but only goes to last request",
                "requires_direction": True,
                "advantages": ["Better than SCAN", "No unnecessary movement"],
                "disadvantages": ["Slightly complex"]
            },
            "C-LOOK": {
                "name": "Circular LOOK",
                "description": "Circular version of LOOK",
                "requires_direction": True,
                "advantages": ["Best uniform wait time"],
                "disadvantages": ["Implementation complexity"]
            }
        }
    }