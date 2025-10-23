from pydantic import BaseModel, Field, field_validator, model_validator, ConfigDict
from typing import List, Optional, Literal

# ============= CPU Scheduling Models =============

class ProcessInput(BaseModel):
    """Single process input"""
    pid: int = Field(..., ge=1, description="Process ID")
    arrival: int = Field(..., ge=0, description="Arrival time")
    burst: int = Field(..., ge=1, description="Burst time")
    priority: int = Field(0, ge=0, description="Priority (0=highest)")


class CPUSchedulingRequest(BaseModel):
    """Request for CPU scheduling simulation"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "algorithm": "FCFS",
                "processes": [
                    {"pid": 1, "arrival": 0, "burst": 5, "priority": 0},
                    {"pid": 2, "arrival": 1, "burst": 3, "priority": 0},
                    {"pid": 3, "arrival": 2, "burst": 8, "priority": 0}
                ]
            }
        }
    )
    
    algorithm: Literal["FCFS", "SJF", "SRTF", "Priority", "RoundRobin"]
    processes: List[ProcessInput] = Field(..., min_length=1, max_length=20)
    time_quantum: Optional[int] = Field(None, ge=1, le=10)
    
    @model_validator(mode='after')
    def validate_round_robin(self):  # ✅ self, not cls
        """Validate time_quantum for RoundRobin"""
        if self.algorithm == 'RoundRobin' and self.time_quantum is None:
            raise ValueError("time_quantum is required for Round Robin")
        return self


# ============= Page Replacement Models =============

class PageReplacementRequest(BaseModel):
    """Request for page replacement simulation"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "algorithm": "FIFO",
                "page_sequence": [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2],
                "frame_count": 3
            }
        }
    )
    
    algorithm: Literal["FIFO", "LRU", "Optimal", "LFU"]
    page_sequence: List[int] = Field(
        ..., 
        min_length=1, 
        max_length=100,
        description="Page reference string"
    )
    frame_count: int = Field(..., ge=1, le=10, description="Number of frames")
    
    @field_validator('page_sequence')
    @classmethod
    def validate_pages(cls, v):
        if any(p < 0 for p in v):
            raise ValueError("Page numbers must be non-negative")
        return v


# ============= Disk Scheduling Models =============

class DiskSchedulingRequest(BaseModel):
    """Request for disk scheduling simulation"""
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "algorithm": "SCAN",
                "request_queue": [98, 183, 37, 122, 14, 124, 65, 67],
                "initial_head": 53,
                "disk_size": 200,
                "direction": "right"
            }
        }
    )
    
    algorithm: Literal["FCFS", "SSTF", "SCAN", "C-SCAN", "LOOK", "C-LOOK"]
    request_queue: List[int] = Field(
        ..., 
        min_length=1, 
        max_length=50,
        description="Disk request queue (cylinder numbers)"
    )
    initial_head: int = Field(..., ge=0, description="Initial head position")
    disk_size: int = Field(200, ge=50, le=500, description="Total disk cylinders")
    direction: Optional[Literal["left", "right"]] = Field(
        "right", 
        description="Initial direction (for SCAN/C-SCAN/LOOK/C-LOOK)"
    )
    
    @model_validator(mode='after')
    def validate_disk_constraints(self):  # ✅ self, not cls
        """Validate disk scheduling constraints"""
        # Validate request queue
        if any(r < 0 or r >= self.disk_size for r in self.request_queue):
            raise ValueError(f"Requests must be within 0-{self.disk_size-1}")
        
        # Validate initial head
        if self.initial_head >= self.disk_size:
            raise ValueError(f"Initial head must be < {self.disk_size}")
        
        return self