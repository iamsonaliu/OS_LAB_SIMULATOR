# unified_main.py - Complete Operating System Algorithms Simulator
"""
Operating System Algorithms Simulator
Phase 1: CPU Scheduling, Page Replacement, and Disk Scheduling
"""

import sys
import os

def display_main_menu():
    """Display the main menu for algorithm selection"""
    print("\n" + "="*70)
    print("   🖥️  OPERATING SYSTEM ALGORITHMS SIMULATOR - CLI")
    print("="*70)
    print("\n📚 Available Simulation Modules:\n")
    print("   1. 🔄 CPU Scheduling Algorithms")
    print("      • FCFS, SJF, SRTF, Priority, Round Robin")
    print()
    print("   2. 📄 Page Replacement Algorithms")
    print("      • FIFO, LRU, Optimal, LFU")
    print()
    print("   3. 💾 Disk Scheduling Algorithms")
    print("      • FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK")
    print()
    print("   4. ❌ Exit")
    print("\n" + "="*70)

def run_cpu_scheduling():
    """Import and run CPU scheduling module"""
    try:
        from cpu_main import run_simulation
        run_simulation()
    except ImportError as e:
        print(f"❌ Error: CPU Scheduling module not found.")
        print(f"   Make sure 'main.py' and 'cpu_scheduling' package exist.")
        print(f"   Details: {e}")
    except Exception as e:
        print(f"❌ Error running CPU scheduling: {e}")

def run_page_replacement():
    """Import and run page replacement module"""
    try:
        from page_main import run_page_simulation
        run_page_simulation()
    except ImportError as e:
        print(f"❌ Error: Page Replacement module not found.")
        print(f"   Make sure 'page_replacement_main.py' and 'page_replacement' package exist.")
        print(f"   Details: {e}")
    except Exception as e:
        print(f"❌ Error running page replacement: {e}")

def run_disk_scheduling():
    """Import and run disk scheduling module"""
    try:
        from disk_main import run_disk_simulation
        run_disk_simulation()
    except ImportError as e:
        print(f"❌ Error: Disk Scheduling module not found.")
        print(f"   Make sure 'disk_scheduling_main.py' and 'disk_scheduling' package exist.")
        print(f"   Details: {e}")
    except Exception as e:
        print(f"❌ Error running disk scheduling: {e}")

def main():
    """Main entry point for unified simulator"""
    # Create necessary directories
    os.makedirs('charts', exist_ok=True)
    
    print("\n" + "🌟" * 35)
    print("Welcome to Operating System Algorithms Simulator!")
    print("🌟" * 35)
    
    while True:
        try:
            display_main_menu()
            
            choice = input("👉 Select module (1-4): ").strip()
            
            if choice == '1':
                print("\n" + "="*70)
                print("           CPU SCHEDULING MODULE")
                print("="*70)
                run_cpu_scheduling()
            
            elif choice == '2':
                print("\n" + "="*70)
                print("         PAGE REPLACEMENT MODULE")
                print("="*70)
                run_page_replacement()
            
            elif choice == '3':
                print("\n" + "="*70)
                print("         DISK SCHEDULING MODULE")
                print("="*70)
                run_disk_scheduling()
            
            elif choice == '4':
                print("\n" + "="*70)
                print("   Thank you for using OS Algorithms Simulator!")
                print("   Phase 1 Complete: CPU, Page, and Disk Scheduling")
                print("="*70)
                print("\n✨ All visualizations saved in 'charts' folder")
                print("👋 Goodbye!\n")
                sys.exit(0)
            
            else:
                print("\n❌ Invalid choice. Please select 1-4.")
                input("\nPress Enter to continue...")
        
        except KeyboardInterrupt:
            print("\n\n⚠️  Program interrupted by user.")
            print("👋 Goodbye!\n")
            sys.exit(0)
        except Exception as e:
            print(f"\n❌ Unexpected error: {e}")
            input("\nPress Enter to continue...")

if __name__ == "__main__":
    main()