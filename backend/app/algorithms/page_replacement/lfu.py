# page_replacement/lfu.py

def lfu(references, frames):
    """
    LFU (Least Frequently Used) Page Replacement Algorithm
    
    Args:
        references: List of page numbers
        frames: Number of frames available
    
    Returns:
        trace_data: List of (page, frames_state, status) tuples
        page_faults: Total number of page faults
    """
    memory = []
    frequency = {}  # Track frequency of each page
    page_faults = 0
    trace_data = []
    
    for page in references:
        # Check if page is already in memory (HIT)
        if page in memory:
            status = "HIT"
            frequency[page] = frequency.get(page, 0) + 1
            trace_data.append((page, memory.copy() + [-1] * (frames - len(memory)), status))
        else:
            # Page fault
            page_faults += 1
            status = "FAULT"
            
            if len(memory) < frames:
                # Frame available
                memory.append(page)
                frequency[page] = 1
            else:
                # Replace least frequently used page
                # If tie, replace the one that appeared first in memory
                lfu_page = min(memory, key=lambda p: (frequency.get(p, 0), -memory.index(p)))
                idx = memory.index(lfu_page)
                memory[idx] = page
                frequency[page] = 1
            
            trace_data.append((page, memory.copy() + [-1] * (frames - len(memory)), status))
    
    return trace_data, page_faults