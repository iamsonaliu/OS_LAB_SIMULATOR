# page_replacement/fifo.py
from collections import deque

def fifo(references, frames):
    """
    FIFO (First In First Out) Page Replacement Algorithm
    
    Args:
        references: List of page numbers
        frames: Number of frames available
    
    Returns:
        trace_data: List of (page, frames_state, status) tuples
        page_faults: Total number of page faults
    """
    memory = []
    queue = deque()
    page_faults = 0
    trace_data = []
    
    for page in references:
        # Check if page is already in memory (HIT)
        if page in memory:
            status = "HIT"
            trace_data.append((page, memory.copy() + [-1] * (frames - len(memory)), status))
        else:
            # Page fault
            page_faults += 1
            status = "FAULT"
            
            if len(memory) < frames:
                # Frame available
                memory.append(page)
                queue.append(page)
            else:
                # Replace oldest page (FIFO)
                oldest = queue.popleft()
                idx = memory.index(oldest)
                memory[idx] = page
                queue.append(page)
            
            trace_data.append((page, memory.copy() + [-1] * (frames - len(memory)), status))
    
    return trace_data, page_faults