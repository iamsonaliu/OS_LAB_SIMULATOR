# main.py
from cpu_scheduling import fcfs, sjf, srtf, priority, round_robin
from cpu_scheduling.utils import (
    Process, generate_comprehensive_report, 
    compute_performance_metrics, print_enhanced_table,
    create_gantt_chart, print_performance_dashboard
)
import sys
import os

def get_user_input():
    """Get user input with proper validation"""
    print("🖥️  Welcome to Advanced CPU Scheduling Simulator")
    print("="*55)
    
    algo_choices = {
        '1': ('FCFS (First Come First Serve)', fcfs),
        '2': ('SJF (Shortest Job First)', sjf),
        '3': ('SRTF (Shortest Remaining Time First)', srtf),
        '4': ('Priority Scheduling (Non-preemptive)', priority),
        '5': ('Round Robin', round_robin),
    }
    
    # Algorithm selection
    print("\n📋 Available Scheduling Algorithms:")
    for key, (name, _) in algo_choices.items():
        print(f"   {key}. {name}")
    print("Enter 0 to exit")
    while True:
        choice = input("\n🔍 Choose algorithm (1-5): ").strip()
        if choice in algo_choices:
            break
        else:
            print("❌ Invalid choice. Please select 1-5.")
    
    algo_name, algo_func = algo_choices[choice]
    algo_name = algo_name.split(' (')[0]  # Clean name for display
    
    # Number of processes
    while True:
        try:
            n = int(input(f"\n📊 Number of processes: "))
            if n > 0:
                break
            else:
                print("❌ Please enter a positive number.")
        except ValueError:
            print("❌ Please enter a valid integer.")
    
    # Process details input
    processes = []
    need_priority = choice == '4'
    need_quantum = choice == '5'
    
    print(f"\n📝 Enter details for {n} processes:")
    print("-" * 40)
    
    for i in range(1, n + 1):
        print(f"\nProcess P{i}:")
        
        # Arrival time
        while True:
            try:
                arrival = int(input(f"  ⏰ Arrival time: "))
                if arrival >= 0:
                    break
                else:
                    print("  ❌ Arrival time must be non-negative.")
            except ValueError:
                print("  ❌ Please enter a valid integer.")
        
        # Burst time
        while True:
            try:
                burst = int(input(f"  ⚡ Burst time: "))
                if burst > 0:
                    break
                else:
                    print("  ❌ Burst time must be positive.")
            except ValueError:
                print("  ❌ Please enter a valid integer.")
        
        # Priority (if needed)
        priority_val = 0
        if need_priority:
            while True:
                try:
                    priority_val = int(input(f"  🎯 Priority (lower number = higher priority): "))
                    break
                except ValueError:
                    print("  ❌ Please enter a valid integer.")
        
        processes.append(Process(i, arrival, burst, priority_val))
    
    # Time quantum for Round Robin
    quantum = None
    if need_quantum:
        while True:
            try:
                quantum = int(input(f"\n⏱️  Time quantum for Round Robin: "))
                if quantum > 0:
                    break
                else:
                    print("❌ Time quantum must be positive.")
            except ValueError:
                print("❌ Please enter a valid integer.")
    
    return algo_name, algo_func, processes, quantum

def display_options_menu():
    """Display output options to user"""
    print("\n🎨 Output Options:")
    print("1. Complete report with Gantt chart visualization")
    print("2. Table and metrics only (no chart)")
    print("3. Quick summary")
    
    while True:
        choice = input("\nChoose output format (1-3): ").strip()
        if choice in ['1', '2', '3']:
            return choice
        print("❌ Invalid choice. Please select 1-3.")

def run_simulation():
    """Main simulation function"""
    try:
        # Get user input
        algo_name, algo_func, processes, quantum = get_user_input()
        
        # Prepare arguments for algorithm
        kwargs = {}
        if quantum is not None:
            kwargs['quantum'] = quantum
        
        print(f"\n🚀 Running {algo_name} scheduling...")
        print("-" * 50)
        
        # Execute algorithm
        try:
            result_processes, gantt = algo_func(processes, **kwargs)
        except Exception as e:
            print(f"❌ Error during algorithm execution: {e}")
            return
        
        # Get output preference
        output_choice = display_options_menu()
        
        if output_choice == '1':
            # Complete report with visualization
            metrics = generate_comprehensive_report(result_processes, gantt, algo_name, save_chart=True)
        
        elif output_choice == '2':
            # Table and metrics only
            print(f"\n📋 PROCESS SCHEDULING RESULTS - {algo_name.upper()}")
            print("="*60)
            
            for p in result_processes:
                p.compute_times()
            
            print("\nProcess Execution Table:")
            print_enhanced_table(result_processes)
            
            metrics = compute_performance_metrics(result_processes, gantt)
            print_performance_dashboard(metrics, algo_name)
        
        else:  # Quick summary
            for p in result_processes:
                p.compute_times()
            
            metrics = compute_performance_metrics(result_processes, gantt)
            
            print(f"\n⚡ QUICK SUMMARY - {algo_name.upper()}")
            print("="*40)
            print(f"Processes: {len(result_processes)}")
            print(f"Avg TAT: {metrics['avg_turnaround']:.2f}")
            print(f"Avg Waiting: {metrics['avg_waiting']:.2f}")
            print(f"CPU Utilization: {metrics['cpu_utilization']:.2f}%")
            print(f"Throughput: {metrics['throughput']:.2f} processes/unit")
        
        # Ask for another simulation
        print(f"\n🔄 Would you like to run another simulation?")
        another = input("Enter 'y' for yes, any other key to exit: ").strip().lower()
        if another == 'y':
            print("\n" + "="*80 + "\n")
            run_simulation()
        else:
            print("\n✨ Thank you for using CPU Scheduling Simulator!")
            print("📁 Check the 'charts' folder for saved Gantt charts.")
    
    except KeyboardInterrupt:
        print("\n\n⚠️  Simulation interrupted by user.")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        print("Please check your input and try again.")

def main():
    """Main entry point"""
    # Create necessary directories
    os.makedirs('charts', exist_ok=True)
    
    try:
        run_simulation()
    except Exception as e:
        print(f"❌ Application error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
