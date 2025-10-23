# disk_scheduling/sstf.py

def sstf(requests, initial_head):
    """
    SSTF (Shortest Seek Time First) Disk Scheduling
    Services the request closest to current head position
    
    Args:
        requests: List of cylinder positions
        initial_head: Initial position of disk head
    
    Returns:
        sequence: Order of serviced requests
    """
    remaining = requests.copy()
    sequence = []
    current = initial_head
    
    while remaining:
        # Find closest request
        closest = min(remaining, key=lambda x: abs(x - current))
        sequence.append(closest)
        remaining.remove(closest)
        current = closest
    
    return sequence