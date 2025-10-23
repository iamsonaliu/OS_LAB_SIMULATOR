from app.algorithms.cpu_scheduling import fcfs, sjf, srtf, priority, round_robin
from app.algorithms.cpu_scheduling.utils import Process
from app.models.requests import CPUSchedulingRequest, ProcessInput
from app.models.responses import (
    CPUSchedulingResponse, CPUMetrics, ProcessResult, TimelineEvent
)
from app.utils.visualization import generate_gantt_chart_base64
from typing import List, Tuple
from app.models.requests import CPUSchedulingRequest, ProcessInput
from app.models.responses import (
    CPUSchedulingResponse, CPUMetrics, ProcessResult, TimelineEvent
)
from app.utils.visualization import generate_gantt_chart_base64
from typing import List, Tuple

class CPUSchedulingService:
    """Service for CPU scheduling algorithms"""
    
    def __init__(self):
        self.algorithms = {
            "FCFS": fcfs,
            "SJF": sjf,
            "SRTF": srtf,
            "Priority": priority,
            "RoundRobin": round_robin
        }
    
    def simulate(self, request: CPUSchedulingRequest) -> CPUSchedulingResponse:
        """Run CPU scheduling simulation"""
        
        # Convert input to Process objects
        processes = self._convert_to_processes(request.processes)
        
        # Get algorithm function
        algo_func = self.algorithms.get(request.algorithm)
        if not algo_func:
            raise ValueError(f"Unknown algorithm: {request.algorithm}")
        
        # Execute algorithm
        if request.algorithm == "RoundRobin":
            result_processes, gantt = algo_func(processes, request.time_quantum)
        else:
            result_processes, gantt = algo_func(processes)
        
        # Compute metrics
        for p in result_processes:
            p.compute_times()
        
        metrics = self._calculate_metrics(result_processes, gantt)
        timeline = self._build_timeline(gantt)
        process_results = self._build_process_results(result_processes)
        
        # Generate chart
        gantt_base64 = generate_gantt_chart_base64(
            timeline, 
            request.algorithm
        )
        
        return CPUSchedulingResponse(
            algorithm=request.algorithm,
            metrics=metrics,
            processes=process_results,
            timeline=timeline,
            gantt_chart=gantt_base64
        )
    
    def _convert_to_processes(self, inputs: List[ProcessInput]) -> List[Process]:
        """Convert Pydantic models to Process objects"""
        return [
            Process(p.pid, p.arrival, p.burst, p.priority)
            for p in inputs
        ]
    
    def _calculate_metrics(self, processes: List[Process], gantt: List[Tuple]) -> CPUMetrics:
        """Calculate performance metrics"""
        n = len(processes)
        
        total_tat = sum(p.turnaround for p in processes)
        total_waiting = sum(p.waiting for p in processes)
        total_response = sum(p.response for p in processes)
        
        avg_tat = total_tat / n
        avg_waiting = total_waiting / n
        avg_response = total_response / n
        
        if gantt:
            total_time = max(end for _, _, end in gantt)
            earliest_arrival = min(p.arrival for p in processes)
            actual_total_time = total_time - earliest_arrival
            
            total_burst_time = sum(p.burst for p in processes)
            cpu_utilization = (total_burst_time / actual_total_time) * 100 if actual_total_time > 0 else 0
            throughput = n / actual_total_time if actual_total_time > 0 else 0
        else:
            cpu_utilization = 0
            throughput = 0
        
        return CPUMetrics(
            avg_waiting_time=round(avg_waiting, 2),
            avg_turnaround_time=round(avg_tat, 2),
            avg_response_time=round(avg_response, 2),
            cpu_utilization=round(cpu_utilization, 2),
            throughput=round(throughput, 4),
            total_processes=n
        )
    
    def _build_timeline(self, gantt: List[Tuple]) -> List[TimelineEvent]:
        """Build timeline from gantt data"""
        return [
            TimelineEvent(
                pid=pid,
                start=start,
                end=end,
                duration=end - start
            )
            for pid, start, end in gantt
        ]
    
    def _build_process_results(self, processes: List[Process]) -> List[ProcessResult]:
        """Build process results"""
        return [
            ProcessResult(
                pid=p.pid,
                arrival=p.arrival,
                burst=p.burst,
                priority=p.priority,
                start=p.start,
                finish=p.finish,
                turnaround=p.turnaround,
                waiting=p.waiting,
                response=p.response
            )
            for p in processes
        ]