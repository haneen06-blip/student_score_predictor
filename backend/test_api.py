import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_schema_and_prediction():
    print("1. Testing GET /schema ...")
    r = client.get("/schema")
    assert r.status_code == 200, f"Error: {r.text}"
    schema = r.json()
    assert "features" in schema
    assert len(schema["features"]) == 13
    print(f"   Schema loaded successfully: {len(schema['features'])} features.")

    print("\n2. Testing POST /api/predict with MISSING feature ...")
    incomplete_payload = {
        "Attendance": 88.0,
        "Hours_Studied": 22.0
        # Missing other required features
    }
    r = client.post("/api/predict", json=incomplete_payload)
    assert r.status_code == 400, f"Expected 400 for missing features, got {r.status_code}"
    print(f"   Correctly caught error: {r.json()['detail']}")

    print("\n3. Testing POST /api/predict with complete valid sample ...")
    valid_payload = {
        "Attendance": 88.0,
        "Hours_Studied": 22.0,
        "Previous_Scores": 80.0,
        "Access_to_Resources": "High",
        "Parental_Involvement": "High",
        "Tutoring_Sessions": 2,
        "Parental_Education_Level": "College",
        "Peer_Influence": "Positive",
        "Distance_from_Home": "Near",
        "Motivation_Level": "High",
        "Teacher_Quality": "High",
        "Extracurricular_Activities": "Yes",
        "Internet_Access": "Yes",
        "student_id": "STU-1001"
    }
    r = client.post("/api/predict", json=valid_payload)
    assert r.status_code == 200, f"Error: {r.text}"
    res = r.json()
    print(f"   Predicted score: {res['predicted_score']}")
    print(f"   Grade: {res['grade_letter']} ({res['performance_band']})")
    print(f"   Percentile: {res['percentile']}%")
    print(f"   Contributions count: {len(res['contributions'])}")

    print("\nALL SCHEMA & PREDICTION BACKEND TESTS PASSED! :)")

if __name__ == "__main__":
    test_schema_and_prediction()
