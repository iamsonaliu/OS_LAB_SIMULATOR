def fcfs_disk(requests, initial_head):
    """
    FCFS (First Come First Serve) Disk Scheduling
    Services requests in the order they arrive
    
    Args:
        requests: List of cylinder positions
        initial_head: Initial position of disk head
    
    Returns:
        sequence: Order of serviced requests
    """
    # Simply return requests in the order they came
    return requests.copy()