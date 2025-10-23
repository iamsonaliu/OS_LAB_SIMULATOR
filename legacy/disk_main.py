# disk_scheduling_main.py
from disk_scheduling import fcfs_disk, sstf, scan, cscan, look, clook
from disk_scheduling.utils import (
    generate_disk_report, compute_disk_metrics,
    print_disk_table, print_disk_dashboard,
    create_disk_chart, print_text_disk_trace
)
import sys
import os

def get_disk_input():
    """Get user input for disk scheduling simulation"""
    print("💾 Welcome to Disk Scheduling Algorithm Simulator")
    print("="*60)
    
    algo_choices = {
        '1': ('FCFS (First Come First Serve)', fcfs_disk, False),
        '2': ('SSTF (Shortest Seek Time First)', sstf, False),
        '3': ('SCAN (Elevator Algorithm)', scan, True),
        '4': ('C-SCAN (Circular SCAN)', cscan, True),
        '5': ('LOOK', look, True),
        '6': ('C-LOOK (Circular LOOK)', clook, True),
    }
    
    # Algorithm selection
    print("\n📋 Available Disk Scheduling Algorithms:")
    for key, (name, _, _) in algo_choices.items():
        print(f"   {key}. {name}")
    
    while True:
        choice = input("\n🔍 Choose algorithm (1-6): ").strip()
        if choice in algo_choices:
            break
        print("❌ Invalid choice. Please select 1-6.")
    
    algo_name, algo_func, needs_direction = algo_choices[choice]
    algo_name = algo_name.split(' (')[0]
    
    # Disk size
    while True:
        try:
            disk_size = int(input(f"\n💿 Total disk size (number of cylinders, default 200): ").strip() or "200")
            if disk_size > 0:
                break
            else:
                print("❌ Please enter a positive number.")
        except ValueError:
            print("❌ Please enter a valid integer.")
    
    # Initial head position
    while True:
        try:
            initial_head = int(input(f"\n📍 Initial head position (0-{disk_size-1}): "))
            if 0 <= initial_head < disk_size:
                break
            else:
                print(f"❌ Please enter a value between 0 and {disk_size-1}.")
        except ValueError:
            print("❌ Please enter a valid integer.")
    
    # Request queue
    print(f"\n📝 Enter disk request queue:")
    print(f"   (Space-separated cylinder numbers 0-{disk_size-1}, e.g., '98 183 37 122 14 124 65 67')")
    
    while True:
        try:
            req_input = input("   Requests: ").strip()
            requests = [int(x) for x in req_input.split()]
            if requests and all(0 <= r < disk_size for r in requests):
                break
            else:
                print(f"❌ Please enter valid cylinders between 0 and {disk_size-1}.")
        except ValueError:
            print("❌ Please enter valid integers separated by spaces.")
    
    # Direction (for algorithms that need it)
    direction = 'right'
    if needs_direction:
        print(f"\n🔄 Initial head direction:")
        print("   1. Right (towards higher cylinders)")
        print("   2. Left (towards lower cylinders)")
        
        while True:
            dir_choice = input("   Choose direction (1-2): ").strip()
            if dir_choice == '1':
                direction = 'right'
                break
            elif dir_choice == '2':
                direction = 'left'
                break
            print("❌ Invalid choice. Please select 1 or 2.")
    
    return algo_name, algo_func, requests, initial_head, direction, disk_size, needs_direction

def display_disk_options():
    """Display output options"""
    print("\n🎨 Output Options:")
    print("1. Complete report with visualization")
    print("2. Table and metrics only")
    print("3. Quick summary")
    
    while True:
        choice = input("\nChoose output format (1-3): ").strip()
        if choice in ['1', '2', '3']:
            return choice
        print("❌ Invalid choice. Please select 1-3.")

def run_disk_simulation():
    """Run disk scheduling simulation"""
    try:
        # Get user input
        algo_name, algo_func, requests, initial_head, direction, disk_size, needs_direction = get_disk_input()
        
        print(f"\n🚀 Running {algo_name} disk scheduling...")
        print("-" * 50)
        
        # Execute algorithm
        try:
            if needs_direction:
                if algo_name in ['SCAN', 'C-SCAN']:
                    sequence = algo_func(requests, initial_head, direction, disk_size)
                else:  # LOOK, C-LOOK
                    sequence = algo_func(requests, initial_head, direction)
            else:
                sequence = algo_func(requests, initial_head)
        except Exception as e:
            print(f"❌ Error during algorithm execution: {e}")
            return
        
        # Get output preference
        output_choice = display_disk_options()
        
        if output_choice == '1':
            # Complete report with visualization
            metrics = generate_disk_report(sequence, initial_head, algo_name, 
                                          disk_size, save_chart=True)
        
        elif output_choice == '2':
            # Table and metrics only
            print(f"\n📋 DISK SCHEDULING RESULTS - {algo_name.upper()}")
            print("="*60)
            
            print_disk_table(sequence, initial_head, algo_name)
            
            metrics = compute_disk_metrics(sequence, initial_head)
            print_disk_dashboard(metrics, algo_name)
        
        else:  # Quick summary
            metrics = compute_disk_metrics(sequence, initial_head)
            
            print(f"\n⚡ QUICK SUMMARY - {algo_name.upper()}")
            print("="*40)
            print(f"Requests: {len(requests)}")
            print(f"Initial Head: {initial_head}")
            print(f"Total Seek Time: {metrics['total_seek']} cylinders")
            print(f"Average Seek: {metrics['avg_seek']:.2f} cylinders")
            print(f"Max Seek: {metrics['max_seek']} cylinders")
            print(f"Min Seek: {metrics['min_seek']} cylinders")
        
        # Ask for another simulation
        print(f"\n🔄 Would you like to run another simulation?")
        another = input("Enter 'y' for yes, any other key to exit: ").strip().lower()
        if another == 'y':
            print("\n" + "="*80 + "\n")
            run_disk_simulation()
        else:
            print("\n✨ Thank you for using Disk Scheduling Simulator!")
            print("📁 Check the 'charts' folder for saved visualizations.")
    
    except KeyboardInterrupt:
        print("\n\n⚠️  Simulation interrupted by user.")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        print("Please check your input and try again.")

def main():
    """Main entry point"""
    os.makedirs('charts', exist_ok=True)
    
    try:
        run_disk_simulation()
    except Exception as e:
        print(f"❌ Application error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()