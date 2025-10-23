# cpu_scheduling/fcfs.py
from .utils import Process

def fcfs(processes):
    processes = sorted(processes, key=lambda p: p.arrival)
    current_time = 0
    gantt = []
    for p in processes:
        if current_time < p.arrival:
            current_time = p.arrival
        p.start = current_time
        current_time += p.burst
        p.finish = current_time
        gantt.append((p.pid, p.start, p.finish))
    return processes, gantt