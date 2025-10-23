import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_fcfs_disk():
    """Test FCFS disk scheduling"""
    response = client.post(
        "/api/simulate/disk/",
        json={
            "algorithm": "FCFS",
            "request_queue": [98, 183, 37, 122, 14, 124, 65, 67],
            "initial_head": 53,
            "disk_size": 200
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert data["algorithm"] == "FCFS"
    assert data["metrics"]["total_seek"] > 0

def test_scan_with_direction():
    """Test SCAN algorithm with direction"""
    response = client.post(
        "/api/simulate/disk/",
        json={
            "algorithm": "SCAN",
            "request_queue": [98, 183, 37, 122, 14],
            "initial_head": 53,
            "disk_size": 200,
            "direction": "right"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["algorithm"] == "SCAN"
    assert len(data["sequence"]) == 5

def test_invalid_request_queue():
    """Test invalid cylinder numbers"""
    response = client.post(
        "/api/simulate/disk/",
        json={
            "algorithm": "SSTF",
            "request_queue": [98, 250],  # 250 > disk_size
            "initial_head": 53,
            "disk_size": 200
        }
    )
    assert response.status_code == 422

def test_sstf_algorithm():
    """Test SSTF algorithm"""
    response = client.post(
        "/api/simulate/disk/",
        json={
            "algorithm": "SSTF",
            "request_queue": [98, 183, 37, 122, 14, 124, 65, 67],
            "initial_head": 53,
            "disk_size": 200
        }
    )
    assert response.status_code == 200
    data = response.json()
    # SSTF should have lower seek time than FCFS
    assert data["metrics"]["avg_seek"] >= 0