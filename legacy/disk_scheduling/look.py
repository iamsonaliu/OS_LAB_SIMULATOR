# disk_scheduling/look.py

def look(requests, initial_head, direction='right'):
    """
    LOOK Disk Scheduling Algorithm
    Similar to SCAN but only goes as far as the last request in each direction
    
    Args:
        requests: List of cylinder positions
        initial_head: Initial position of disk head
        direction: 'right' (towards higher cylinders) or 'left' (towards lower)
    
    Returns:
        sequence: Order of serviced requests
    """
    sequence = []
    
    # Separate requests into left and right of head
    left = sorted([r for r in requests if r < initial_head], reverse=True)
    right = sorted([r for r in requests if r >= initial_head])
    
    if direction == 'right':
        # Service right side first (up to last request), then left side
        sequence.extend(right)
        sequence.extend(left)
    else:  # direction == 'left'
        # Service left side first (down to last request), then right side
        sequence.extend(left)
        sequence.extend(right)
    
    return sequence