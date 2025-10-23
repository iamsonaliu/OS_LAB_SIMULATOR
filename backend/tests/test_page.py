import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_fifo_simulation():
    """Test FIFO page replacement"""
    response = client.post(
        "/api/simulate/page/",
        json={
            "algorithm": "FIFO",
            "page_sequence": [7, 0, 1, 2, 0, 3, 0, 4, 2, 3],
            "frame_count": 3
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert data["algorithm"] == "FIFO"
    assert "metrics" in data
    assert data["metrics"]["page_faults"] > 0

def test_lru_simulation():
    """Test LRU algorithm"""
    response = client.post(
        "/api/simulate/page/",
        json={
            "algorithm": "LRU",
            "page_sequence": [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5],
            "frame_count": 4
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["algorithm"] == "LRU"
    assert data["metrics"]["total_references"] == 12

def test_invalid_frame_count():
    """Test invalid frame count"""
    response = client.post(
        "/api/simulate/page/",
        json={
            "algorithm": "FIFO",
            "page_sequence": [1, 2, 3],
            "frame_count": 0
        }
    )
    assert response.status_code == 422

def test_optimal_algorithm():
    """Test Optimal algorithm"""
    response = client.post(
        "/api/simulate/page/",
        json={
            "algorithm": "Optimal",
            "page_sequence": [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2],
            "frame_count": 3
        }
    )
    assert response.status_code == 200
    data = response.json()
    # Optimal should have lowest page faults
    assert data["metrics"]["hit_ratio"] >= 0