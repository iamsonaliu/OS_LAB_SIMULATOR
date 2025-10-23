import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_fcfs_simulation():
    """Test FCFS algorithm"""
    response = client.post(
        "/api/simulate/cpu/",
        json={
            "algorithm": "FCFS",
            "processes": [
                {"pid": 1, "arrival": 0, "burst": 5, "priority": 0},
                {"pid": 2, "arrival": 1, "burst": 3, "priority": 0},
                {"pid": 3, "arrival": 2, "burst": 8, "priority": 0}
            ]
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert data["algorithm"] == "FCFS"
    assert "metrics" in data
    assert "gantt_chart" in data
    assert data["metrics"]["total_processes"] == 3

def test_round_robin_with_quantum():
    """Test Round Robin with time quantum"""
    response = client.post(
        "/api/simulate/cpu/",
        json={
            "algorithm": "RoundRobin",
            "processes": [
                {"pid": 1, "arrival": 0, "burst": 5, "priority": 0},
                {"pid": 2, "arrival": 1, "burst": 3, "priority": 0}
            ],
            "time_quantum": 2
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["algorithm"] == "RoundRobin"

def test_round_robin_without_quantum():
    """Test Round Robin fails without time quantum"""
    response = client.post(
        "/api/simulate/cpu/",
        json={
            "algorithm": "RoundRobin",
            "processes": [{"pid": 1, "arrival": 0, "burst": 5, "priority": 0}]
        }
    )
    assert response.status_code == 422  # Validation error

def test_invalid_algorithm():
    """Test invalid algorithm"""
    response = client.post(
        "/api/simulate/cpu/",
        json={
            "algorithm": "InvalidAlgo",
            "processes": [{"pid": 1, "arrival": 0, "burst": 5, "priority": 0}]
        }
    )
    assert response.status_code == 422

def test_get_algorithms():
    """Test GET algorithms endpoint"""
    response = client.get("/api/simulate/cpu/algorithms")
    assert response.status_code == 200
    data = response.json()
    assert "algorithms" in data
    assert "FCFS" in data["algorithms"]
    assert "descriptions" in data

def test_empty_processes():
    """Test empty process list"""
    response = client.post(
        "/api/simulate/cpu/",
        json={
            "algorithm": "FCFS",
            "processes": []
        }
    )
    assert response.status_code == 422

def test_priority_scheduling():
    """Test Priority algorithm"""
    response = client.post(
        "/api/simulate/cpu/",
        json={
            "algorithm": "Priority",
            "processes": [
                {"pid": 1, "arrival": 0, "burst": 5, "priority": 2},
                {"pid": 2, "arrival": 1, "burst": 3, "priority": 1},
                {"pid": 3, "arrival": 2, "burst": 8, "priority": 3}
            ]
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["metrics"]["avg_waiting_time"] >= 0