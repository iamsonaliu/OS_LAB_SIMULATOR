from fastapi import APIRouter, HTTPException, status
from app.models.requests import PageReplacementRequest
from app.models.responses import PageReplacementResponse
from app.services.page_service import PageReplacementService
from typing import Dict, Any  # ✅ Add Any

router = APIRouter()
service = PageReplacementService()

@router.post(
    "/",
    response_model=PageReplacementResponse,
    status_code=status.HTTP_200_OK,
    summary="Simulate Page Replacement",
    description="""
    Simulate page replacement algorithms with custom page reference strings.
    
    **Supported Algorithms:**
    - **FIFO** (First In First Out): Replaces oldest page
    - **LRU** (Least Recently Used): Replaces least recently accessed page
    - **Optimal** (Belady's Algorithm): Replaces page not used for longest time (theoretical)
    - **LFU** (Least Frequently Used): Replaces least frequently accessed page
    
    **Returns:**
    - Frame state trace at each step
    - Page fault count and hit ratio
    - Visualization (Base64 PNG)
    """
)
async def simulate_page_replacement(request: PageReplacementRequest):
    """Execute page replacement simulation"""
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
    """Get list of available page replacement algorithms"""
    return {
        "algorithms": ["FIFO", "LRU", "Optimal", "LFU"],
        "descriptions": {
            "FIFO": {
                "name": "First In First Out",
                "description": "Replaces the oldest page in memory",
                "complexity": "O(1) per reference",
                "advantages": ["Simple", "Easy to implement"],
                "disadvantages": ["Belady's anomaly", "Ignores page usage patterns"]
            },
            "LRU": {
                "name": "Least Recently Used",
                "description": "Replaces page not used for longest time",
                "complexity": "O(n) per reference",
                "advantages": ["Good performance", "Considers recency"],
                "disadvantages": ["Implementation overhead", "Requires tracking"]
            },
            "Optimal": {
                "name": "Optimal (Belady's Algorithm)",
                "description": "Replaces page not needed for longest future time",
                "complexity": "O(n) per reference",
                "advantages": ["Theoretically optimal", "Minimum page faults"],
                "disadvantages": ["Impossible to implement", "Requires future knowledge"]
            },
            "LFU": {
                "name": "Least Frequently Used",
                "description": "Replaces page with lowest access frequency",
                "complexity": "O(n) per reference",
                "advantages": ["Considers frequency"],
                "disadvantages": ["May not adapt to changes", "Complex to implement"]
            }
        }
    }