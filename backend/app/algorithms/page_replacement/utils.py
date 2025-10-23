# page_replacement/utils.py
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import seaborn as sns
from tabulate import tabulate
import numpy as np
import os
from datetime import datetime

class PageReference:
    """Class to store page reference information"""
    def __init__(self, page_num, is_hit):
        self.page_num = page_num
        self.is_hit = is_hit

def compute_page_metrics(references, page_faults, frames):
    """
    Calculate comprehensive page replacement metrics:
    - Total Page Faults
    - Total Page Hits
    - Hit Ratio
    - Fault Ratio
    """
    total_refs = len(references)
    hits = total_refs - page_faults
    
    hit_ratio = (hits / total_refs * 100) if total_refs > 0 else 0
    fault_ratio = (page_faults / total_refs * 100) if total_refs > 0 else 0
    
    return {
        'total_references': total_refs,
        'page_faults': page_faults,
        'page_hits': hits,
        'hit_ratio': hit_ratio,
        'fault_ratio': fault_ratio,
        'frames': frames
    }

def print_page_table(trace_data, algorithm_name):
    """Print page replacement execution trace"""
    print(f"\n📋 PAGE REPLACEMENT TRACE - {algorithm_name.upper()}")
    print("="*80)
    
    headers = ["Step", "Page Ref", "Frames", "Status"]
    data = []
    
    for i, (page, frames, status) in enumerate(trace_data, 1):
        frame_str = " | ".join(f"{f}" if f != -1 else "_" for f in frames)
        data.append([i, page, frame_str, status])
    
    print(tabulate(data, headers=headers, tablefmt="grid"))

def create_page_chart(trace_data, references, metrics, algorithm_name, save_path=None):
    """Create visualization for page replacement"""
    if not trace_data:
        print("No trace data available")
        return None
    
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10))
    
    # Chart 1: Frame allocation over time
    steps = range(1, len(trace_data) + 1)
    frames_count = metrics['frames']
    
    # Prepare data for stacked area chart
    frame_matrix = np.zeros((frames_count, len(trace_data)))
    
    for i, (page, frames, status) in enumerate(trace_data):
        for j, frame in enumerate(frames):
            if frame != -1:
                frame_matrix[j][i] = frame
    
    # Color map for pages
    unique_pages = sorted(set(references))
    colors = plt.cm.Set3(np.linspace(0, 1, len(unique_pages)))
    page_colors = {page: colors[i] for i, page in enumerate(unique_pages)}
    
    # Plot frame allocation
    for i in range(frames_count):
        y_pos = [i + 0.4] * len(trace_data)
        for j in range(len(trace_data)):
            page = frame_matrix[i][j]
            if page > 0:
                color = page_colors.get(int(page), 'lightgray')
                ax1.barh(y_pos[j], 1, left=j, height=0.8, 
                        color=color, edgecolor='black', linewidth=0.5)
                ax1.text(j + 0.5, y_pos[j], f"{int(page)}", 
                        ha='center', va='center', fontweight='bold', fontsize=9)
    
    ax1.set_xlabel('Reference Step', fontsize=11, fontweight='bold')
    ax1.set_ylabel('Frame Number', fontsize=11, fontweight='bold')
    ax1.set_title(f'Frame Allocation Timeline - {algorithm_name}', 
                  fontsize=13, fontweight='bold', pad=15)
    ax1.set_yticks(range(frames_count))
    ax1.set_yticklabels([f"Frame {i}" for i in range(frames_count)])
    ax1.grid(True, axis='x', alpha=0.3, linestyle='--')
    
    # Chart 2: Hit/Fault visualization
    hit_fault = [1 if status == "HIT" else 0 for _, _, status in trace_data]
    colors_hf = ['green' if x == 1 else 'red' for x in hit_fault]
    
    ax2.bar(steps, [1]*len(steps), color=colors_hf, alpha=0.7, edgecolor='black')
    ax2.set_xlabel('Reference Step', fontsize=11, fontweight='bold')
    ax2.set_ylabel('Status', fontsize=11, fontweight='bold')
    ax2.set_title('Page Hits and Faults', fontsize=13, fontweight='bold', pad=15)
    ax2.set_yticks([0.5])
    ax2.set_yticklabels(['Hit/Fault'])
    ax2.set_ylim(0, 1.2)
    
    # Add legend
    hit_patch = mpatches.Patch(color='green', label='Hit', alpha=0.7)
    fault_patch = mpatches.Patch(color='red', label='Fault', alpha=0.7)
    ax2.legend(handles=[hit_patch, fault_patch], loc='upper right')
    
    # Add reference numbers on top
    for i, (page, _, _) in enumerate(trace_data):
        ax2.text(i + 1, 1.1, f"P{page}", ha='center', va='bottom', 
                fontsize=8, fontweight='bold')
    
    plt.tight_layout()
    
    # Save chart
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"Page replacement chart saved to: {save_path}")
    else:
        os.makedirs('charts', exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"charts/page_replacement_{algorithm_name}_{timestamp}.png"
        plt.savefig(filename, dpi=300, bbox_inches='tight')
        print(f"Page replacement chart saved to: {filename}")
    
    plt.show()
    return fig

def print_page_dashboard(metrics, algorithm_name):
    """Print comprehensive page replacement metrics dashboard"""
    print("\n" + "="*60)
    print(f"      PERFORMANCE METRICS - {algorithm_name.upper()}")
    print("="*60)
    
    print(f"\n📊 Reference Statistics:")
    print(f"   • Total Page References: {metrics['total_references']}")
    print(f"   • Number of Frames: {metrics['frames']}")
    
    print(f"\n📈 Fault/Hit Analysis:")
    print(f"   • Page Faults: {metrics['page_faults']}")
    print(f"   • Page Hits: {metrics['page_hits']}")
    print(f"   • Fault Ratio: {metrics['fault_ratio']:.2f}%")
    print(f"   • Hit Ratio: {metrics['hit_ratio']:.2f}%")
    
    # Performance assessment
    print(f"\n✨ Performance Assessment:")
    if metrics['hit_ratio'] >= 70:
        print("   ✓ Excellent hit ratio - Very efficient!")
    elif metrics['hit_ratio'] >= 50:
        print("   ✓ Good hit ratio - Satisfactory performance")
    elif metrics['hit_ratio'] >= 30:
        print("   ⚠ Moderate hit ratio - Room for improvement")
    else:
        print("   ⚠ Low hit ratio - Consider increasing frames")
    
    print("="*60)

def print_text_page_trace(trace_data):
    """Print simple text-based page replacement trace"""
    if not trace_data:
        print("No trace data available")
        return
    
    print("\nPage Replacement Trace:")
    print("-" * 50)
    for i, (page, frames, status) in enumerate(trace_data, 1):
        frame_str = "[" + " | ".join(f"{f:2}" if f != -1 else " _" for f in frames) + "]"
        print(f"Step {i:2d}: Page {page:2d} -> {frame_str} ({status})")

def generate_page_report(references, trace_data, page_faults, frames, algorithm_name, save_chart=True):
    """Generate complete page replacement report"""
    print("\n" + "="*80)
    print(f"          PAGE REPLACEMENT SIMULATION RESULTS")
    print(f"              Algorithm: {algorithm_name.upper()}")
    print("="*80)
    
    # Print trace table
    print_page_table(trace_data, algorithm_name)
    
    # Calculate and display metrics
    metrics = compute_page_metrics(references, page_faults, frames)
    print_page_dashboard(metrics, algorithm_name)
    
    # Generate visualization
    if trace_data and save_chart:
        print(f"\n📊 VISUALIZATION:")
        create_page_chart(trace_data, references, metrics, algorithm_name)
    else:
        print(f"\n📊 TEXT-BASED TRACE:")
        print_text_page_trace(trace_data)
    
    return metrics