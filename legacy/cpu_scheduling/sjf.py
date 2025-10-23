# cpu_scheduling/sjf.py
from .utils import Process

def sjf(processes):
    processes = sorted(processes, key=lambda p: p.arrival)
    n = len(processes)
    completed = [False] * n
    current_time = 0
    gantt = []
    completed_count = 0
    while completed_count < n:
        idx = -1
        min_burst = float('inf')
        for i in range(n):
            if not completed[i] and processes[i].arrival <= current_time and processes[i].burst < min_burst:
                min_burst = processes[i].burst
                idx = i
        if idx == -1:
            current_time += 1
            continue
        p = processes[idx]
        p.start = current_time
        current_time += p.burst
        p.finish = current_time
        gantt.append((p.pid, p.start, p.finish))
        completed[idx] = True
        completed_count += 1
    return processes, gantt