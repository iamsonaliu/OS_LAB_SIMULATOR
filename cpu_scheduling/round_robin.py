# cpu_scheduling/round_robin.py
from .utils import Process
from collections import deque

def round_robin(processes, quantum):
    processes = sorted(processes, key=lambda p: p.arrival)
    n = len(processes)
    queue = deque()
    current_time = 0
    gantt = []
    i = 0
    current_p = None
    current_start = -1
    while True:
        while i < n and processes[i].arrival <= current_time:
            queue.append(processes[i])
            i += 1
        if not queue:
            if i < n:
                current_time = processes[i].arrival
                continue
            else:
                break
        p = queue.popleft()
        if current_p != p:
            if current_p:
                gantt.append((current_p.pid, current_start, current_time))
            if p.start == -1:
                p.start = current_time
            current_start = current_time
            current_p = p
        exec_time = min(quantum, p.remaining)
        current_time += exec_time
        p.remaining -= exec_time
        if p.remaining > 0:
            queue.append(p)
            current_p = None  # Will switch next iteration
        else:
            p.finish = current_time
            current_p = None
            gantt.append((p.pid, current_start, current_time))
    if current_p:
        gantt.append((current_p.pid, current_start, current_time))
    return processes, gantt