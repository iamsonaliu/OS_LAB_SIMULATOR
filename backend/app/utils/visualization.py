import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from io import BytesIO
import base64
from typing import List

def generate_gantt_chart_base64(timeline: List, algorithm: str) -> str:
    """Generate Gantt chart and return as base64 PNG"""
    fig, ax = plt.subplots(figsize=(14, 6))
    
    # Color palette
    unique_pids = sorted(set(event.pid for event in timeline))
    colors = plt.cm.Set3(np.linspace(0, 1, len(unique_pids)))
    pid_colors = {pid: colors[i] for i, pid in enumerate(unique_pids)}
    
    # Draw bars
    for event in timeline:
        ax.barh(
            1, 
            event.duration, 
            left=event.start,
            height=0.6,
            color=pid_colors[event.pid],
            edgecolor='black',
            linewidth=1.5,
            alpha=0.8
        )
        
        # Add label
        ax.text(
            event.start + event.duration / 2,
            1,
            f'P{event.pid}',
            ha='center',
            va='center',
            fontweight='bold',
            fontsize=11
        )
    
    # Styling
    ax.set_ylim(0.5, 1.5)
    ax.set_xlabel('Time Units', fontsize=12, fontweight='bold')
    ax.set_title(
        f'CPU Scheduling Gantt Chart - {algorithm}',
        fontsize=14,
        fontweight='bold',
        pad=20
    )
    ax.set_yticks([])
    ax.grid(True, axis='x', alpha=0.3, linestyle='--')
    
    # Legend
    legend_elements = [
        mpatches.Patch(color=pid_colors[pid], label=f'Process P{pid}')
        for pid in unique_pids
    ]
    ax.legend(handles=legend_elements, loc='upper right', fontsize=10)
    
    plt.tight_layout()
    
    # Convert to base64
    buffer = BytesIO()
    fig.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode()
    plt.close(fig)
    
    return f"data:image/png;base64,{image_base64}"

def generate_page_chart_base64(
    trace_data: List, 
    references: List[int],
    frames: int,
    algorithm: str
) -> str:
    """Generate page replacement visualization"""
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10))
    
    # Chart 1: Frame state over time
    steps = range(1, len(trace_data) + 1)
    frame_matrix = np.zeros((frames, len(trace_data)))
    
    for i, (page, frame_state, status) in enumerate(trace_data):
        for j, frame in enumerate(frame_state):
            if frame != -1:
                frame_matrix[j][i] = frame
    
    # Color map
    unique_pages = sorted(set(references))
    colors = plt.cm.Set3(np.linspace(0, 1, len(unique_pages)))
    page_colors = {page: colors[i] for i, page in enumerate(unique_pages)}
    
    # Plot frames
    for i in range(frames):
        y_pos = [i + 0.4] * len(trace_data)
        for j in range(len(trace_data)):
            page = frame_matrix[i][j]
            if page > 0:
                color = page_colors.get(int(page), 'lightgray')
                ax1.barh(
                    y_pos[j], 1, left=j, height=0.8,
                    color=color, edgecolor='black', linewidth=0.5
                )
                ax1.text(
                    j + 0.5, y_pos[j], f"{int(page)}",
                    ha='center', va='center', fontweight='bold', fontsize=9
                )
    
    ax1.set_xlabel('Reference Step', fontsize=11, fontweight='bold')
    ax1.set_ylabel('Frame Number', fontsize=11, fontweight='bold')
    ax1.set_title(
        f'Frame Allocation - {algorithm}',
        fontsize=13, fontweight='bold', pad=15
    )
    ax1.set_yticks(range(frames))
    ax1.set_yticklabels([f"Frame {i}" for i in range(frames)])
    ax1.grid(True, axis='x', alpha=0.3)
    
    # Chart 2: Hits/Faults
    hit_fault = [1 if status == "HIT" else 0 for _, _, status in trace_data]
    colors_hf = ['green' if x == 1 else 'red' for x in hit_fault]
    
    ax2.bar(steps, [1]*len(steps), color=colors_hf, alpha=0.7, edgecolor='black')
    ax2.set_xlabel('Reference Step', fontsize=11, fontweight='bold')
    ax2.set_ylabel('Status', fontsize=11, fontweight='bold')
    ax2.set_title('Page Hits and Faults', fontsize=13, fontweight='bold', pad=15)
    ax2.set_yticks([0.5])
    ax2.set_yticklabels(['Hit/Fault'])
    ax2.set_ylim(0, 1.2)
    
    # Add reference labels
    for i, (page, _, _) in enumerate(trace_data):
        ax2.text(i + 1, 1.1, f"P{page}", ha='center', va='bottom', fontsize=8)
    
    plt.tight_layout()
    
    # Convert to base64
    buffer = BytesIO()
    fig.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode()
    plt.close(fig)
    
    return f"data:image/png;base64,{image_base64}"

def generate_disk_chart_base64(
    sequence: List[int],
    initial_head: int,
    disk_size: int,
    algorithm: str
) -> str:
    """Generate disk scheduling visualization"""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))
    
    # Chart 1: Head movement
    full_sequence = [initial_head] + sequence
    steps = range(len(full_sequence))
    
    ax1.plot(steps, full_sequence, marker='o', linewidth=2, markersize=8, color='blue')
    ax1.scatter([0], [initial_head], color='green', s=200, marker='s', zorder=5)
    ax1.scatter([len(full_sequence)-1], [full_sequence[-1]], color='red', s=200, marker='s', zorder=5)
    
    # Labels
    for i, pos in enumerate(full_sequence):
        ax1.annotate(
            f'{pos}', (i, pos),
            textcoords="offset points",
            xytext=(0, 10), ha='center', fontsize=9, fontweight='bold'
        )
    
    ax1.set_xlabel('Request Sequence', fontsize=11, fontweight='bold')
    ax1.set_ylabel('Cylinder Position', fontsize=11, fontweight='bold')
    ax1.set_title(f'Head Movement - {algorithm}', fontsize=13, fontweight='bold', pad=15)
    ax1.grid(True, alpha=0.3, linestyle='--')
    ax1.set_ylim(-5, disk_size + 5)
    
    # Chart 2: Seek time distribution
    seeks = [abs(sequence[i] - (initial_head if i == 0 else sequence[i-1])) 
             for i in range(len(sequence))]
    
    colors = plt.cm.RdYlGn_r(np.linspace(0.2, 0.8, len(seeks)))
    bars = ax2.bar(range(1, len(seeks) + 1), seeks, color=colors, 
                   edgecolor='black', linewidth=1)
    
    # Add value labels
    for bar, seek in zip(bars, seeks):
        height = bar.get_height()
        ax2.text(
            bar.get_x() + bar.get_width()/2., height,
            f'{int(seek)}', ha='center', va='bottom', fontsize=9
        )
    
    # Average line
    avg_seek = sum(seeks) / len(seeks)
    ax2.axhline(y=avg_seek, color='blue', linestyle='--', 
                linewidth=2, label=f"Avg: {avg_seek:.2f}")
    
    ax2.set_xlabel('Request Number', fontsize=11, fontweight='bold')
    ax2.set_ylabel('Seek Time (Cylinders)', fontsize=11, fontweight='bold')
    ax2.set_title('Seek Time Distribution', fontsize=13, fontweight='bold', pad=15)
    ax2.grid(True, axis='y', alpha=0.3)
    ax2.legend()
    
    plt.tight_layout()
    
    # Convert to base64
    buffer = BytesIO()
    fig.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode()
    plt.close(fig)
    
    return f"data:image/png;base64,{image_base64}"