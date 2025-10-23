# disk_scheduling/cscan.py

def cscan(requests, initial_head, direction='right', disk_size=200):
    """
    C-SCAN (Circular SCAN) Disk Scheduling Algorithm
    Moves in one direction, services requests, jumps to other end, continues
    
    Args:
        requests: List of cylinder positions
        initial_head: Initial position of disk head
        direction: 'right' (towards higher cylinders) or 'left' (towards lower)
        disk_size: Total number of cylinders (default 200)
    
    Returns:
        sequence: Order of serviced requests
    """
    sequence = []
    
    # Separate requests into left and right of head
    left = sorted([r for r in requests if r < initial_head])
    right = sorted([r for r in requests if r >= initial_head])
    
    if direction == 'right':
        # Service right side, jump to start, then left side
        sequence.extend(right)
        # Jump to beginning (cylinder 0) and service left side
        sequence.extend(left)
    else:  # direction == 'left'
        # Service left side (reverse order), jump to end, then right side (reverse)
        sequence.extend(reversed(left))
        # Jump to end and service right side
        sequence.extend(reversed(right))
    
    return sequence