# disk_scheduling/scan.py

def scan(requests, initial_head, direction='right', disk_size=200):
    """
    SCAN (Elevator) Disk Scheduling Algorithm
    Moves in one direction, services all requests until end, then reverses
    
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
    left = sorted([r for r in requests if r < initial_head], reverse=True)
    right = sorted([r for r in requests if r >= initial_head])
    
    if direction == 'right':
        # Service right side first, go to end, then left side
        sequence.extend(right)
        if right and right[-1] != disk_size - 1:
            # Head goes to end if there are requests on right
            pass  # We go to end implicitly by servicing all right requests
        sequence.extend(left)
    else:  # direction == 'left'
        # Service left side first, go to start, then right side
        sequence.extend(left)
        if left and left[-1] != 0:
            # Head goes to start if there are requests on left
            pass  # We go to start implicitly by servicing all left requests
        sequence.extend(right)
    
    return sequence