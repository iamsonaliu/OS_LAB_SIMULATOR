# cpu_scheduling/__init__.py
from .fcfs import fcfs
from .sjf import sjf
from .srtf import srtf
from .priority import priority
from .round_robin import round_robin
from .utils import (
    Process, 
    compute_averages,  # Legacy
    print_table,       # Legacy 
    print_gantt,       # Legacy
    # New enhanced functions
    compute_performance_metrics,
    print_enhanced_table,
    create_gantt_chart,
    print_performance_dashboard,
    generate_comprehensive_report,
    print_text_gantt
)