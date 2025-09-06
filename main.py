from cpu_scheduling import fcfs, sjf, srtf, priority, round_robin
from cpu_scheduling.utils import Process, compute_averages, print_table, print_gantt

def main():
    print("Welcome to CPU Scheduling Simulator")
    algo_choices = {
        '1': ('FCFS', fcfs),
        '2': ('SJF', sjf),
        '3': ('SRTF', srtf),
        '4': ('Priority', priority),  # Corrected reference to the priority function
        '5': ('Round Robin', round_robin),
    }
    choice = input("Choose algorithm (1: FCFS, 2: SJF, 3: SRTF, 4: Priority, 5: RR): ")
    if choice not in algo_choices:
        print("Invalid choice")
        return
    algo_name, algo_func = algo_choices[choice]

    n = int(input("Number of processes: "))
    processes = []
    need_priority = choice == '4'
    need_quantum = choice == '5'
    for i in range(1, n + 1):
        pid = i
        arrival = int(input(f"Arrival time for P{pid}: "))
        burst = int(input(f"Burst time for P{pid}: "))
        priority_val = 0
        if need_priority:
            priority_val = int(input(f"Priority for P{pid} (lower number = higher priority): "))
        processes.append(Process(pid, arrival, burst, priority_val))

    kwargs = {}
    if need_quantum:
        kwargs['quantum'] = int(input("Time quantum for RR: "))

    processes, gantt = algo_func(processes, **kwargs)

    for p in processes:
        p.compute_times()

    avg_wait, avg_turn = compute_averages(processes)

    print("\nProcess Table:")
    print_table(processes)

    print("\n")
    print_gantt(gantt)

    print(f"\nAverage Waiting Time: {avg_wait:.2f}")
    print(f"Average Turnaround Time: {avg_turn:.2f}")

if __name__ == "__main__":
    main()