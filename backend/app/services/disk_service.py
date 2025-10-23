from app.algorithms.disk_scheduling import fcfs_disk, sstf, scan, cscan, look, clook
from app.models.requests import DiskSchedulingRequest
from app.models.responses import (
    DiskSchedulingResponse, DiskMetrics, DiskSeekStep
)
from app.utils.visualization import generate_disk_chart_base64
from typing import List
from app.models.responses import (
    DiskSchedulingResponse, DiskMetrics, DiskSeekStep
)
from app.utils.visualization import generate_disk_chart_base64
from typing import List

class DiskSchedulingService:
    """Service for disk scheduling algorithms"""
    
    def __init__(self):
        self.algorithms = {
            "FCFS": fcfs_disk,
            "SSTF": sstf,
            "SCAN": scan,
            "C-SCAN": cscan,
            "LOOK": look,
            "C-LOOK": clook
        }
        self.directional_algos = {"SCAN", "C-SCAN", "LOOK", "C-LOOK"}
    
    def simulate(self, request: DiskSchedulingRequest) -> DiskSchedulingResponse:
        """Run disk scheduling simulation"""
        
        # Get algorithm function
        algo_func = self.algorithms.get(request.algorithm)
        if not algo_func:
            raise ValueError(f"Unknown algorithm: {request.algorithm}")
        
        # Execute algorithm
        if request.algorithm in self.directional_algos:
            if request.algorithm in ["SCAN", "C-SCAN"]:
                sequence = algo_func(
                    request.request_queue,
                    request.initial_head,
                    request.direction,
                    request.disk_size
                )
            else:  # LOOK, C-LOOK
                sequence = algo_func(
                    request.request_queue,
                    request.initial_head,
                    request.direction
                )
        else:
            sequence = algo_func(request.request_queue, request.initial_head)
        
        # Calculate metrics
        metrics, trace = self._calculate_metrics(sequence, request.initial_head)
        
        # Generate visualization
        visualization = generate_disk_chart_base64(
            sequence,
            request.initial_head,
            request.disk_size,
            request.algorithm
        )
        
        return DiskSchedulingResponse(
            algorithm=request.algorithm,
            metrics=metrics,
            sequence=sequence,
            trace=trace,
            visualization=visualization
        )
    
    def _calculate_metrics(
        self, 
        sequence: List[int], 
        initial_head: int
    ) -> tuple[DiskMetrics, List[DiskSeekStep]]:
        """Calculate disk scheduling metrics"""
        total_seek = 0
        seeks = []
        trace = []
        
        current = initial_head
        for i, pos in enumerate(sequence):
            seek = abs(pos - current)
            seeks.append(seek)
            total_seek += seek
            
            trace.append(DiskSeekStep(
                step=i + 1,
                from_cylinder=current,
                to_cylinder=pos,
                seek_distance=seek,
                cumulative_seek=total_seek
            ))
            
            current = pos
        
        metrics = DiskMetrics(
            total_seek=total_seek,
            avg_seek=round(total_seek / len(sequence), 2) if sequence else 0,
            max_seek=max(seeks) if seeks else 0,
            min_seek=min(seeks) if seeks else 0,
            total_requests=len(sequence)
        )
        
        return metrics, trace