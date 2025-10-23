# page_replacement/optimal.py

def optimal(references, frames):
    """
    Optimal Page Replacement Algorithm (Belady's Algorithm)
    Replaces the page that will not be used for the longest time
    
    Args:
        references: List of page numbers
        frames: Number of frames available
    
    Returns:
        trace_data: List of (page, frames_state, status) tuples
        page_faults: Total number of page faults
    """
    memory = []
    page_faults = 0
    trace_data = []
    
    for i, page in enumerate(references):
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
            else:
                # Find page to replace (one that will be used farthest in future)
                future_use = {}
                for mem_page in memory:
                    try:
                        # Find next use of this page
                        next_use = references[i+1:].index(mem_page) + i + 1
                        future_use[mem_page] = next_use
                    except ValueError:
                        # Page not used again - replace this one
                        future_use[mem_page] = float('inf')
                
                # Replace page with farthest next use
                page_to_replace = max(future_use, key=future_use.get)
                idx = memory.index(page_to_replace)
                memory[idx] = page
            
            trace_data.append((page, memory.copy() + [-1] * (frames - len(memory)), status))
    
    return trace_data, page_faults