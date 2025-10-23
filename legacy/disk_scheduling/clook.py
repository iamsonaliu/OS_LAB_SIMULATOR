# disk_scheduling/clook.py

def clook(requests, initial_head, direction='right'):
    """
    C-LOOK (Circular LOOK) Disk Scheduling Algorithm
    Similar to C-SCAN but only goes as far as the last request in each direction
    
    Args:
        requests: List of cylinder positions
        initial_head: Initial position of disk head
        direction: 'right' (towards higher cylinders) or 'left' (towards lower)
    
    Returns:
        sequence: Order of serviced requests
    """
    sequence = []
    
    # Separate requests into left and right of head
    left = sorted([r for r in requests if r < initial_head])
    right = sorted([r for r in requests if r >= initial_head])
    
    if direction == 'right':
        # Service right side, jump to leftmost request, continue
        sequence.extend(right)
        sequence.extend(left)
    else:  # direction == 'left'
        # Service left side (reverse), jump to rightmost, continue (reverse)
        sequence.extend(reversed(left))
        sequence.extend(reversed(right))
    
    return sequence