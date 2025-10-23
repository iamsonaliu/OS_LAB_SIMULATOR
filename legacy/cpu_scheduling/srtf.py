# cpu_scheduling/srtf.py
import heapq
from .utils import Process

def srtf(processes):
    processes = sorted(processes, key=lambda p: p.arrival)
    n = len(processes)
    current_time = 0
    ready_queue = []  # (remaining, pid, process)
    gantt = []
    i = 0
    current_p = None
    current_start = -1
    while True:
        while i < n and processes[i].arrival <= current_time:
            heapq.heappush(ready_queue, (processes[i].remaining, processes[i].pid, processes[i]))
            i += 1
        if not ready_queue:
            if i < n:
                current_time = processes[i].arrival
                continue
            else:
                break
        rem, pid, p = heapq.heappop(ready_queue)
        if current_p != p:
            if current_p:
                gantt.append((current_p.pid, current_start, current_time))
            if p.start == -1:
                p.start = current_time
            current_start = current_time
            current_p = p
        p.remaining -= 1
        current_time += 1
        if p.remaining > 0:
            heapq.heappush(ready_queue, (p.remaining, p.pid, p))
        else:
            p.finish = current_time
            current_p = None
            gantt.append((p.pid, current_start, current_time))
    if current_p:
        gantt.append((current_p.pid, current_start, current_time))
    return processes, gantt