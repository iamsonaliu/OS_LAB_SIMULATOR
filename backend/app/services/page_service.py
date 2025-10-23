from app.algorithms.page_replacement import fifo, lru, optimal, lfu
from app.models.requests import PageReplacementRequest
from app.models.responses import (
    PageReplacementResponse, PageMetrics, PageTraceStep
)
from app.utils.visualization import generate_page_chart_base64
from typing import List, Tuple
from app.models.responses import (
    PageReplacementResponse, PageMetrics, PageTraceStep
)
from app.utils.visualization import generate_page_chart_base64
from typing import List, Tuple

class PageReplacementService:
    """Service for page replacement algorithms"""
    
    def __init__(self):
        self.algorithms = {
            "FIFO": fifo,
            "LRU": lru,
            "Optimal": optimal,
            "LFU": lfu
        }
    
    def simulate(self, request: PageReplacementRequest) -> PageReplacementResponse:
        """Run page replacement simulation"""
        
        # Get algorithm function
        algo_func = self.algorithms.get(request.algorithm)
        if not algo_func:
            raise ValueError(f"Unknown algorithm: {request.algorithm}")
        
        # Execute algorithm
        trace_data, page_faults = algo_func(
            request.page_sequence, 
            request.frame_count
        )
        
        # Calculate metrics
        metrics = self._calculate_metrics(
            request.page_sequence, 
            page_faults, 
            request.frame_count
        )
        
        # Build trace
        trace = self._build_trace(trace_data)
        
        # Generate visualization
        visualization = generate_page_chart_base64(
            trace_data,
            request.page_sequence,
            request.frame_count,
            request.algorithm
        )
        
        return PageReplacementResponse(
            algorithm=request.algorithm,
            metrics=metrics,
            trace=trace,
            visualization=visualization
        )
    
    def _calculate_metrics(
        self, 
        references: List[int], 
        page_faults: int, 
        frames: int
    ) -> PageMetrics:
        """Calculate page replacement metrics"""
        total_refs = len(references)
        hits = total_refs - page_faults
        
        hit_ratio = (hits / total_refs * 100) if total_refs > 0 else 0
        fault_ratio = (page_faults / total_refs * 100) if total_refs > 0 else 0
        
        return PageMetrics(
            total_references=total_refs,
            page_faults=page_faults,
            page_hits=hits,
            hit_ratio=round(hit_ratio, 2),
            fault_ratio=round(fault_ratio, 2),
            frames=frames
        )
    
    def _build_trace(self, trace_data: List[Tuple]) -> List[PageTraceStep]:
        """Build trace from raw data"""
        return [
            PageTraceStep(
                step=i + 1,
                page=page,
                frames_state=frames,
                status=status
            )
            for i, (page, frames, status) in enumerate(trace_data)
        ]