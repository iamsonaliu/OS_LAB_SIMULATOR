from fastapi import APIRouter, HTTPException, status
from app.models.requests import CPUSchedulingRequest
from app.models.responses import CPUSchedulingResponse, ErrorResponse
from app.services.cpu_service import CPUSchedulingService
from typing import Dict, Any, List  # ✅ Add Any here

router = APIRouter()
service = CPUSchedulingService()

@router.post(
    "/",
    response_model=CPUSchedulingResponse,
    status_code=status.HTTP_200_OK,
    summary="Simulate CPU Scheduling",
    description="""
    Simulate CPU scheduling algorithms with custom process configurations.
    
    **Supported Algorithms:**
    - **FCFS** (First Come First Serve): Non-preemptive, processes executed in arrival order
    - **SJF** (Shortest Job First): Non-preemptive, shortest burst time first
    - **SRTF** (Shortest Remaining Time First): Preemptive SJF
    - **Priority**: Non-preemptive priority-based scheduling (lower number = higher priority)
    - **RoundRobin**: Preemptive time-quantum based scheduling
    
    **Returns:**
    - Process execution timeline
    - Performance metrics (waiting time, turnaround time, CPU utilization)
    - Gantt chart visualization (Base64 PNG)
    """
)
async def simulate_cpu_scheduling(request: CPUSchedulingRequest):
    """Execute CPU scheduling simulation"""
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
    summary="Get Available Algorithms",
    description="Returns list of supported CPU scheduling algorithms with descriptions"
)
async def get_algorithms():
    """Get list of available CPU scheduling algorithms"""
    return {
        "algorithms": ["FCFS", "SJF", "SRTF", "Priority", "RoundRobin"],
        "descriptions": {
            "FCFS": {
                "name": "First Come First Serve",
                "type": "Non-preemptive",
                "description": "Executes processes in order of arrival",
                "time_complexity": "O(n)",
                "advantages": ["Simple", "Easy to implement"],
                "disadvantages": ["High waiting time", "Convoy effect"]
            },
            "SJF": {
                "name": "Shortest Job First",
                "type": "Non-preemptive",
                "description": "Executes shortest burst time first",
                "time_complexity": "O(n²)",
                "advantages": ["Minimum average waiting time"],
                "disadvantages": ["Starvation possible", "Requires burst time knowledge"]
            },
            "SRTF": {
                "name": "Shortest Remaining Time First",
                "type": "Preemptive",
                "description": "Preemptive version of SJF",
                "time_complexity": "O(n²)",
                "advantages": ["Optimal average waiting time"],
                "disadvantages": ["High context switching", "Starvation possible"]
            },
            "Priority": {
                "name": "Priority Scheduling",
                "type": "Non-preemptive",
                "description": "Executes based on priority (lower number = higher priority)",
                "time_complexity": "O(n²)",
                "advantages": ["Important tasks first"],
                "disadvantages": ["Starvation possible", "Indefinite blocking"]
            },
            "RoundRobin": {
                "name": "Round Robin",
                "type": "Preemptive",
                "description": "Time-quantum based circular scheduling",
                "time_complexity": "O(n)",
                "advantages": ["Fair allocation", "No starvation"],
                "disadvantages": ["High context switching", "Performance depends on quantum"]
            }
        }
    }

@router.post(
    "/compare",
    summary="Compare Multiple Algorithms",
    description="Run same process set on multiple algorithms for comparison",
    response_model=Dict[str, Any]  # ✅ Add response model
)
async def compare_algorithms(
    processes: List[Dict[str, int]],  # ✅ Changed type
    algorithms: List[str],
    time_quantum: int = 2
):
    """Compare multiple algorithms with same process set"""
    results = {}
    
    for algo in algorithms:
        try:
            # Convert dict to ProcessInput
            from app.models.requests import ProcessInput
            process_inputs = [ProcessInput(**p) for p in processes]
            
            request = CPUSchedulingRequest(
                algorithm=algo,
                processes=process_inputs,
                time_quantum=time_quantum if algo == "RoundRobin" else None
            )
            result = service.simulate(request)
            results[algo] = {
                "avg_waiting_time": result.metrics.avg_waiting_time,
                "avg_turnaround_time": result.metrics.avg_turnaround_time,
                "cpu_utilization": result.metrics.cpu_utilization,
                "throughput": result.metrics.throughput
            }
        except Exception as e:
            results[algo] = {"error": str(e)}
    
    return {"comparison": results}