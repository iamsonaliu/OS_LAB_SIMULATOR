# cpu_scheduling/utils.py
class Process:
    def __init__(self, pid, arrival, burst, priority=0):
        self.pid = pid
        self.arrival = arrival
        self.burst = burst
        self.priority = priority
        self.remaining = burst
        self.start = -1
        self.finish = -1
        self.turnaround = 0
        self.waiting = 0

    def compute_times(self):
        if self.finish == -1 or self.arrival == -1:
            raise ValueError("Process times not set")
        self.turnaround = self.finish - self.arrival
        self.waiting = self.turnaround - self.burst

def compute_averages(processes):
    total_wait = sum(p.waiting for p in processes)
    total_turn = sum(p.turnaround for p in processes)
    n = len(processes)
    return total_wait / n, total_turn / n

def print_table(processes):
    from tabulate import tabulate
    data = [
        [p.pid, p.arrival, p.burst, p.priority, p.start, p.finish, p.turnaround, p.waiting]
        for p in processes
    ]
    headers = ["PID", "Arrival", "Burst", "Priority", "Start", "Finish", "Turnaround", "Waiting"]
    print(tabulate(data, headers=headers, tablefmt="grid"))

def print_gantt(gantt):
    gantt = sorted(gantt, key=lambda x: x[1])
    print("Gantt Chart:")
    for pid, start, end in gantt:
        print(f"P{pid} from {start} to {end}")