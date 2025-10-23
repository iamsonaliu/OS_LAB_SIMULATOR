# page_replacement/lru.py

def lru(references, frames):
    """
    LRU (Least Recently Used) Page Replacement Algorithm
    
    Args:
        references: List of page numbers
        frames: Number of frames available
    
    Returns:
        trace_data: List of (page, frames_state, status) tuples
        page_faults: Total number of page faults
    """
    memory = []
    recent_use = {}  # Track last use time for each page
    page_faults = 0
    trace_data = []
    
    for time, page in enumerate(references):
        # Check if page is already in memory (HIT)
        if page in memory:
            status = "HIT"
            recent_use[page] = time
            trace_data.append((page, memory.copy() + [-1] * (frames - len(memory)), status))
        else:
            # Page fault
            page_faults += 1
            status = "FAULT"
            
            if len(memory) < frames:
                # Frame available
                memory.append(page)
            else:
                # Replace least recently used page
                lru_page = min(memory, key=lambda p: recent_use.get(p, -1))
                idx = memory.index(lru_page)
                memory[idx] = page
            
            recent_use[page] = time
            trace_data.append((page, memory.copy() + [-1] * (frames - len(memory)), status))
    
    return trace_data, page_faults