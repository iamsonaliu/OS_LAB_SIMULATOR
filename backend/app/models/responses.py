from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

# ============= Common Models =============
class TimelineEvent(BaseModel):
    """Timeline event for Gantt chart"""
    pid: int
    start: int
    end: int
    duration: int

class MetricsBase(BaseModel):
    """Base metrics model"""
    pass

# ============= CPU Response Models =============
class CPUMetrics(MetricsBase):
    """CPU scheduling metrics"""
    avg_waiting_time: float = Field(..., description="Average waiting time")
    avg_turnaround_time: float = Field(..., description="Average turnaround time")
    avg_response_time: float = Field(..., description="Average response time")
    cpu_utilization: float = Field(..., description="CPU utilization percentage")
    throughput: float = Field(..., description="Throughput (processes/unit time)")
    total_processes: int

class ProcessResult(BaseModel):
    """Individual process result"""
    pid: int
    arrival: int
    burst: int
    priority: int
    start: int
    finish: int
    turnaround: int
    waiting: int
    response: int

class CPUSchedulingResponse(BaseModel):
    """Response for CPU scheduling"""
    success: bool = True
    algorithm: str
    metrics: CPUMetrics
    processes: List[ProcessResult]
    timeline: List[TimelineEvent]
    gantt_chart: str = Field(..., description="Base64 encoded PNG")

# ============= Page Response Models =============
class PageMetrics(MetricsBase):
    """Page replacement metrics"""
    total_references: int
    page_faults: int
    page_hits: int
    hit_ratio: float = Field(..., description="Hit ratio percentage")
    fault_ratio: float = Field(..., description="Fault ratio percentage")
    frames: int

class PageTraceStep(BaseModel):
    """Single step in page replacement trace"""
    step: int
    page: int
    frames_state: List[int] = Field(..., description="Current frame state (-1 = empty)")
    status: str = Field(..., description="HIT or FAULT")

class PageReplacementResponse(BaseModel):
    """Response for page replacement"""
    success: bool = True
    algorithm: str
    metrics: PageMetrics
    trace: List[PageTraceStep]
    visualization: str = Field(..., description="Base64 encoded PNG")

# ============= Disk Response Models =============
class DiskMetrics(MetricsBase):
    """Disk scheduling metrics"""
    total_seek: int = Field(..., description="Total seek time (cylinders)")
    avg_seek: float = Field(..., description="Average seek time")
    max_seek: int
    min_seek: int
    total_requests: int

class DiskSeekStep(BaseModel):
    """Single step in disk scheduling"""
    step: int
    from_cylinder: int
    to_cylinder: int
    seek_distance: int
    cumulative_seek: int

class DiskSchedulingResponse(BaseModel):
    """Response for disk scheduling"""
    success: bool = True
    algorithm: str
    metrics: DiskMetrics
    sequence: List[int] = Field(..., description="Order of serviced requests")
    trace: List[DiskSeekStep]
    visualization: str = Field(..., description="Base64 encoded PNG")

# ============= Error Response =============
class ErrorResponse(BaseModel):
    """Error response"""
    success: bool = False
    error: str
    detail: Optional[str] = None

# ============= Health Check =============
class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    algorithms: Dict[str, List[str]]