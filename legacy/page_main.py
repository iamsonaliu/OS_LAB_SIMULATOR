# page_replacement_main.py
from page_replacement import fifo, lru, optimal, lfu
from page_replacement.utils import (
    generate_page_report, compute_page_metrics,
    print_page_table, print_page_dashboard,
    create_page_chart, print_text_page_trace
)
import sys
import os

def get_page_input():
    """Get user input for page replacement simulation"""
    print("🖥️  Welcome to Page Replacement Algorithm Simulator")
    print("="*60)
    
    algo_choices = {
        '1': ('FIFO (First In First Out)', fifo),
        '2': ('LRU (Least Recently Used)', lru),
        '3': ('Optimal (Belady\'s Algorithm)', optimal),
        '4': ('LFU (Least Frequently Used)', lfu),
    }
    
    # Algorithm selection
    print("\n📋 Available Page Replacement Algorithms:")
    for key, (name, _) in algo_choices.items():
        print(f"   {key}. {name}")
    
    while True:
        choice = input("\n🔍 Choose algorithm (1-4): ").strip()
        if choice in algo_choices:
            break
        print("❌ Invalid choice. Please select 1-4.")
    
    algo_name, algo_func = algo_choices[choice]
    algo_name = algo_name.split(' (')[0]
    
    # Number of frames
    while True:
        try:
            frames = int(input(f"\n📊 Number of frames in memory: "))
            if frames > 0:
                break
            else:
                print("❌ Please enter a positive number.")
        except ValueError:
            print("❌ Please enter a valid integer.")
    
    # Page reference string
    print(f"\n📝 Enter page reference string:")
    print("   (Space-separated page numbers, e.g., '7 0 1 2 0 3 0 4 2 3')")
    
    while True:
        try:
            ref_input = input("   Pages: ").strip()
            references = [int(x) for x in ref_input.split()]
            if references:
                break
            else:
                print("❌ Please enter at least one page number.")
        except ValueError:
            print("❌ Please enter valid integers separated by spaces.")
    
    return algo_name, algo_func, references, frames

def display_page_options():
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

def run_page_simulation():
    """Run page replacement simulation"""
    try:
        # Get user input
        algo_name, algo_func, references, frames = get_page_input()
        
        print(f"\n🚀 Running {algo_name} page replacement...")
        print("-" * 50)
        
        # Execute algorithm
        try:
            trace_data, page_faults = algo_func(references, frames)
        except Exception as e:
            print(f"❌ Error during algorithm execution: {e}")
            return
        
        # Get output preference
        output_choice = display_page_options()
        
        if output_choice == '1':
            # Complete report with visualization
            metrics = generate_page_report(references, trace_data, page_faults, 
                                          frames, algo_name, save_chart=True)
        
        elif output_choice == '2':
            # Table and metrics only
            print(f"\n📋 PAGE REPLACEMENT RESULTS - {algo_name.upper()}")
            print("="*60)
            
            print_page_table(trace_data, algo_name)
            
            metrics = compute_page_metrics(references, page_faults, frames)
            print_page_dashboard(metrics, algo_name)
        
        else:  # Quick summary
            metrics = compute_page_metrics(references, page_faults, frames)
            
            print(f"\n⚡ QUICK SUMMARY - {algo_name.upper()}")
            print("="*40)
            print(f"Page References: {len(references)}")
            print(f"Frames: {frames}")
            print(f"Page Faults: {page_faults}")
            print(f"Page Hits: {metrics['page_hits']}")
            print(f"Hit Ratio: {metrics['hit_ratio']:.2f}%")
            print(f"Fault Ratio: {metrics['fault_ratio']:.2f}%")
        
        # Ask for another simulation
        print(f"\n🔄 Would you like to run another simulation?")
        another = input("Enter 'y' for yes, any other key to exit: ").strip().lower()
        if another == 'y':
            print("\n" + "="*80 + "\n")
            run_page_simulation()
        else:
            print("\n✨ Thank you for using Page Replacement Simulator!")
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
        run_page_simulation()
    except Exception as e:
        print(f"❌ Application error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()