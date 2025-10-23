# disk_scheduling/utils.py
import matplotlib.pyplot as plt
import numpy as np
import os
from datetime import datetime
from tabulate import tabulate

def compute_disk_metrics(sequence, initial_head):
    """
    Calculate comprehensive disk scheduling metrics:
    - Total Head Movement (Seek Time)
    - Average Seek Time
    - Maximum Seek
    - Minimum Seek
    """
    if not sequence:
        return {}
    
    total_seek = 0
    seeks = []
    
    current = initial_head
    for pos in sequence:
        seek = abs(pos - current)
        seeks.append(seek)
        total_seek += seek
        current = pos
    
    return {
        'total_seek': total_seek,
        'avg_seek': total_seek / len(sequence) if sequence else 0,
        'max_seek': max(seeks) if seeks else 0,
        'min_seek': min(seeks) if seeks else 0,
        'total_requests': len(sequence),
        'seeks_list': seeks
    }

def print_disk_table(sequence, initial_head, algorithm_name):
    """Print disk scheduling execution trace"""
    print(f"\n📋 DISK SCHEDULING TRACE - {algorithm_name.upper()}")
    print("="*70)
    
    headers = ["Step", "From", "To", "Seek", "Cumulative"]
    data = []
    
    current = initial_head
    cumulative = 0
    
    for i, pos in enumerate(sequence, 1):
        seek = abs(pos - current)
        cumulative += seek
        data.append([i, current, pos, seek, cumulative])
        current = pos
    
    print(tabulate(data, headers=headers, tablefmt="grid", numalign="center"))

def create_disk_chart(sequence, initial_head, metrics, algorithm_name, disk_size=200, save_path=None):
    """Create visualization for disk scheduling"""
    if not sequence:
        print("No sequence data available")
        return None
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))
    
    # Chart 1: Head movement graph
    full_sequence = [initial_head] + sequence
    steps = range(len(full_sequence))
    
    ax1.plot(steps, full_sequence, marker='o', linewidth=2, 
             markersize=8, color='blue', label='Head Position')
    ax1.axhline(y=initial_head, color='red', linestyle='--', 
                alpha=0.5, label=f'Initial Head: {initial_head}')
    
    # Mark start and end
    ax1.scatter([0], [initial_head], color='green', s=200, 
                marker='s', zorder=5, label='Start')
    ax1.scatter([len(full_sequence)-1], [full_sequence[-1]], 
                color='red', s=200, marker='s', zorder=5, label='End')
    
    # Add value labels
    for i, pos in enumerate(full_sequence):
        ax1.annotate(f'{pos}', (i, pos), textcoords="offset points", 
                    xytext=(0,10), ha='center', fontsize=9, fontweight='bold')
    
    ax1.set_xlabel('Request Sequence', fontsize=11, fontweight='bold')
    ax1.set_ylabel('Cylinder Position', fontsize=11, fontweight='bold')
    ax1.set_title(f'Head Movement - {algorithm_name}', 
                  fontsize=13, fontweight='bold', pad=15)
    ax1.grid(True, alpha=0.3, linestyle='--')
    ax1.legend(loc='best')
    ax1.set_ylim(-5, disk_size + 5)
    
    # Chart 2: Seek time distribution
    seeks = metrics['seeks_list']
    colors = plt.cm.RdYlGn_r(np.linspace(0.2, 0.8, len(seeks)))
    
    bars = ax2.bar(range(1, len(seeks) + 1), seeks, color=colors, 
                   edgecolor='black', linewidth=1)
    
    # Add value labels on bars
    for i, (bar, seek) in enumerate(zip(bars, seeks)):
        height = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2., height,
                f'{int(seek)}', ha='center', va='bottom', fontsize=9)
    
    ax2.axhline(y=metrics['avg_seek'], color='blue', linestyle='--', 
                linewidth=2, label=f"Avg: {metrics['avg_seek']:.2f}")
    
    ax2.set_xlabel('Request Number', fontsize=11, fontweight='bold')
    ax2.set_ylabel('Seek Time (Cylinders)', fontsize=11, fontweight='bold')
    ax2.set_title('Seek Time Distribution', fontsize=13, fontweight='bold', pad=15)
    ax2.grid(True, axis='y', alpha=0.3, linestyle='--')
    ax2.legend(loc='best')
    
    plt.tight_layout()
    
    # Save chart
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"Disk scheduling chart saved to: {save_path}")
    else:
        os.makedirs('charts', exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"charts/disk_scheduling_{algorithm_name}_{timestamp}.png"
        plt.savefig(filename, dpi=300, bbox_inches='tight')
        print(f"Disk scheduling chart saved to: {filename}")
    
    plt.show()
    return fig

def print_disk_dashboard(metrics, algorithm_name):
    """Print comprehensive disk scheduling metrics dashboard"""
    print("\n" + "="*60)
    print(f"      PERFORMANCE METRICS - {algorithm_name.upper()}")
    print("="*60)
    
    print(f"\n💾 Request Statistics:")
    print(f"   • Total Requests: {metrics['total_requests']}")
    
    print(f"\n📊 Seek Analysis:")
    print(f"   • Total Seek Time: {metrics['total_seek']} cylinders")
    print(f"   • Average Seek Time: {metrics['avg_seek']:.2f} cylinders")
    print(f"   • Maximum Seek: {metrics['max_seek']} cylinders")
    print(f"   • Minimum Seek: {metrics['min_seek']} cylinders")
    
    # Performance assessment
    print(f"\n✨ Performance Assessment:")
    if metrics['avg_seek'] <= 10:
        print("   ✓ Excellent - Very low average seek time!")
    elif metrics['avg_seek'] <= 20:
        print("   ✓ Good - Reasonable seek time")
    elif metrics['avg_seek'] <= 40:
        print("   ⚠ Moderate - Consider optimization")
    else:
        print("   ⚠ High seek time - Algorithm may not be optimal")
    
    print("="*60)

def print_text_disk_trace(sequence, initial_head):
    """Print simple text-based disk scheduling trace"""
    if not sequence:
        print("No sequence data available")
        return
    
    print("\nDisk Head Movement Trace:")
    print("-" * 50)
    
    current = initial_head
    total = 0
    
    print(f"Initial Head Position: {initial_head}")
    print()
    
    for i, pos in enumerate(sequence, 1):
        seek = abs(pos - current)
        total += seek
        print(f"Step {i:2d}: {current:3d} → {pos:3d}  (Seek: {seek:3d}, Total: {total:4d})")
        current = pos
    
    print()
    print(f"Total Head Movement: {total} cylinders")

def generate_disk_report(sequence, initial_head, algorithm_name, disk_size=200, save_chart=True):
    """Generate complete disk scheduling report"""
    print("\n" + "="*80)
    print(f"           DISK SCHEDULING SIMULATION RESULTS")
    print(f"                Algorithm: {algorithm_name.upper()}")
    print("="*80)
    
    # Print trace table
    print_disk_table(sequence, initial_head, algorithm_name)
    
    # Calculate and display metrics
    metrics = compute_disk_metrics(sequence, initial_head)
    print_disk_dashboard(metrics, algorithm_name)
    
    # Generate visualization
    if sequence and save_chart:
        print(f"\n📊 VISUALIZATION:")
        create_disk_chart(sequence, initial_head, metrics, algorithm_name, disk_size)
    else:
        print(f"\n📊 TEXT-BASED TRACE:")
        print_text_disk_trace(sequence, initial_head)
    
    return metrics