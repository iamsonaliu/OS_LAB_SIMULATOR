# cpu_scheduling/utils.py
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import seaborn as sns
from tabulate import tabulate
import numpy as np
import os
from datetime import datetime

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
        self.response = 0

    def compute_times(self):
        """Compute all timing metrics for the process"""
        if self.finish == -1 or self.arrival == -1 or self.start == -1:
            raise ValueError(f"Process P{self.pid} times not properly set")
        
        self.turnaround = self.finish - self.arrival  # TAT = Completion - Arrival
        self.waiting = self.turnaround - self.burst    # WT = TAT - Burst
        self.response = self.start - self.arrival      # RT = Start - Arrival

def compute_performance_metrics(processes, gantt):
    """
    Calculate comprehensive performance metrics including:
    - Average Turn Around Time
    - Average Waiting Time  
    - Average Response Time
    - CPU Utilization
    - Throughput
    """
    n = len(processes)
    if n == 0:
        return {}
    
    # Basic averages
    total_tat = sum(p.turnaround for p in processes)
    total_waiting = sum(p.waiting for p in processes)
    total_response = sum(p.response for p in processes)
    
    avg_tat = total_tat / n
    avg_waiting = total_waiting / n
    avg_response = total_response / n
    
    # CPU Utilization and Throughput
    if gantt:
        total_time = max(end for _, _, end in gantt)
        earliest_arrival = min(p.arrival for p in processes)
        actual_total_time = total_time - earliest_arrival
        
        # CPU Utilization = (Total Burst Time / Total Time) * 100
        total_burst_time = sum(p.burst for p in processes)
        cpu_utilization = (total_burst_time / actual_total_time) * 100 if actual_total_time > 0 else 0
        
        # Throughput = Number of processes / Total Time
        throughput = n / actual_total_time if actual_total_time > 0 else 0
    else:
        cpu_utilization = 0
        throughput = 0
    
    return {
        'avg_turnaround': avg_tat,
        'avg_waiting': avg_waiting,
        'avg_response': avg_response,
        'cpu_utilization': cpu_utilization,
        'throughput': throughput,
        'total_processes': n
    }

def print_enhanced_table(processes):
    """Print comprehensive process table with all required metrics"""
    # Prepare data for tabulation
    data = []
    for p in processes:
        data.append([
            f"P{p.pid}",
            p.arrival,
            p.burst,
            p.start,
            p.finish,
            p.turnaround,
            p.waiting,
            p.response
        ])
    
    headers = [
        "PID", "Arrival", "Burst", "Start", 
        "Complete", "TAT", "Waiting", "Response"
    ]
    
    print(tabulate(data, headers=headers, tablefmt="grid", numalign="center"))

def create_gantt_chart(gantt, processes, algorithm_name, save_path=None):
    """
    Create an advanced Gantt chart with matplotlib
    """
    if not gantt:
        print("No Gantt chart data available")
        return None
    
    # Set up the plot style
    plt.style.use('default')
    fig, ax = plt.subplots(figsize=(14, 8))
    
    # Color palette for processes
    colors = plt.cm.Set3(np.linspace(0, 1, len(set(pid for pid, _, _ in gantt))))
    process_colors = {}
    color_idx = 0
    
    # Create bars for each process execution
    y_pos = 1
    bars = []
    labels = []
    
    for pid, start, end in sorted(gantt, key=lambda x: x[1]):
        if pid not in process_colors:
            process_colors[pid] = colors[color_idx % len(colors)]
            color_idx += 1
        
        duration = end - start
        bar = ax.barh(y_pos, duration, left=start, height=0.6, 
                     color=process_colors[pid], alpha=0.8, 
                     edgecolor='black', linewidth=1.2)
        bars.append(bar)
        
        # Add process label in the middle of the bar
        ax.text(start + duration/2, y_pos, f'P{pid}', 
               ha='center', va='center', fontweight='bold', fontsize=10)
    
    # Customize the chart
    ax.set_ylim(0.5, 1.5)
    ax.set_xlabel('Time Units', fontsize=12, fontweight='bold')
    ax.set_title(f'Gantt Chart - {algorithm_name} Scheduling', 
                fontsize=14, fontweight='bold', pad=20)
    
    # Remove y-axis ticks and labels
    ax.set_yticks([])
    ax.set_ylabel('')
    
    # Add grid for better readability
    ax.grid(True, axis='x', alpha=0.3, linestyle='--')
    
    # Create legend
    unique_processes = sorted(set(pid for pid, _, _ in gantt))
    legend_elements = [mpatches.Rectangle((0, 0), 1, 1, 
                                        facecolor=process_colors[pid], 
                                        label=f'Process P{pid}')
                      for pid in unique_processes]
    ax.legend(handles=legend_elements, loc='upper right', 
             bbox_to_anchor=(1.12, 1), fontsize=10)
    
    # Add timeline markers
    max_time = max(end for _, _, end in gantt)
    time_ticks = range(0, int(max_time) + 2, max(1, int(max_time) // 10))
    ax.set_xticks(time_ticks)
    
    # Adjust layout to prevent legend cutoff
    plt.tight_layout()
    
    # Save or display the chart
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"Gantt chart saved to: {save_path}")
    else:
        # Create charts directory if it doesn't exist
        os.makedirs('charts', exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"charts/gantt_chart_{algorithm_name}_{timestamp}.png"
        plt.savefig(filename, dpi=300, bbox_inches='tight')
        print(f"Gantt chart saved to: {filename}")
    
    plt.show()
    return fig

def print_performance_dashboard(metrics, algorithm_name):
    """Print a comprehensive performance metrics dashboard"""
    print("\n" + "="*60)
    print(f"           PERFORMANCE METRICS - {algorithm_name.upper()}")
    print("="*60)
    
    print(f" Process Statistics:")
    print(f"   • Total Processes: {metrics['total_processes']}")
    print(f"   • Algorithm Used: {algorithm_name}")
    
    print(f"\n Timing Metrics:")
    print(f"   • Average Turn Around Time: {metrics['avg_turnaround']:.2f} units")
    print(f"   • Average Waiting Time: {metrics['avg_waiting']:.2f} units")
    print(f"   • Average Response Time: {metrics['avg_response']:.2f} units")
    
    print(f"\nSystem Performance:")
    print(f"   • CPU Utilization: {metrics['cpu_utilization']:.2f}%")
    print(f"   • Throughput: {metrics['throughput']:.2f} processes/unit")
    
    # Performance assessment
    print(f"\nPerformance Assessment:")
    if metrics['cpu_utilization'] >= 90:
        print("Excellent CPU utilization")
    elif metrics['cpu_utilization'] >= 70:
        print("Good CPU utilization") 
    else:
        print("Room for improvement in CPU utilization")
    
    if metrics['avg_waiting'] <= 5:
        print("Low average waiting time")
    elif metrics['avg_waiting'] <= 10:
        print("Moderate average waiting time")
    else:
        print("High average waiting time")
    
    print("="*60)

def generate_comprehensive_report(processes, gantt, algorithm_name, save_chart=True):
    """
    Generate a complete report with table, metrics, and visualization
    """
    print("\n" + "="*80)
    print(f"               CPU SCHEDULING SIMULATION RESULTS")
    print(f"                    Algorithm: {algorithm_name.upper()}")
    print("="*80)
    
    # Compute all timing metrics
    for p in processes:
        p.compute_times()
    
    # Print enhanced process table
    print("\nPROCESS EXECUTION DETAILS:")
    print_enhanced_table(processes)
    
    # Calculate and display performance metrics
    metrics = compute_performance_metrics(processes, gantt)
    print_performance_dashboard(metrics, algorithm_name)
    
    # Generate Gantt chart
    if gantt and save_chart:
        print(f"\n📊 GANTT CHART VISUALIZATION:")
        create_gantt_chart(gantt, processes, algorithm_name)
    else:
        # Fallback text-based Gantt chart
        print(f"\n📊 GANTT CHART (Text-based):")
        print_text_gantt(gantt)
    
    return metrics

def print_text_gantt(gantt):
    """Print a simple text-based Gantt chart as fallback"""
    if not gantt:
        print("No scheduling data available")
        return
    
    print("Timeline:")
    gantt_sorted = sorted(gantt, key=lambda x: x[1])
    timeline = ""
    labels = ""
    
    for i, (pid, start, end) in enumerate(gantt_sorted):
        duration = end - start
        process_block = f"P{pid}" + "-" * (duration - 1) if duration > 1 else f"P{pid}"
        timeline += process_block
        labels += f"{start}" + " " * (len(process_block) - len(str(start)))
        
        if i < len(gantt_sorted) - 1:
            timeline += "|"
            labels += "|"
    
    print(labels)
    print(timeline)
    print(f"0{' ' * (len(timeline) - 1)}{gantt_sorted[-1][2]}")

# Legacy functions for backward compatibility
def compute_averages(processes):
    """Legacy function - use compute_performance_metrics instead"""
    total_wait = sum(p.waiting for p in processes)
    total_turn = sum(p.turnaround for p in processes)
    n = len(processes)
    return total_wait / n, total_turn / n

def print_table(processes):
    """Legacy function - use print_enhanced_table instead"""
    print_enhanced_table(processes)

def print_gantt(gantt):
    """Legacy function - use print_text_gantt instead"""
    print_text_gantt(gantt)