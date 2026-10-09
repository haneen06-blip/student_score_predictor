from fastapi import FastAPI, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List

from .schemas import (
    StudentInput,
    PredictionResponse,
    BatchPredictionRequest,
    BatchPredictionResponse,
    WhatIfRequest,
    WhatIfResponse,
    ModelMetadataResponse
)
from .model_service import model_service

app = FastAPI(
    title="Student Score Predictive Analytics API",
    description="Empirical academic score forecasting engine based on the trained scikit-learn pipeline.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["General"])
async def root():
    return {
        "status": "online",
        "service": "Student Score Predictive Analytics API",
        "version": "1.0.0",
        "schema_endpoint": "/schema",
        "documentation": "/docs",
        "health": "/health"
    }

@app.get("/health", tags=["General"])
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model_service.model is not None,
        "engine": "Scikit-Learn Standardized Linear Regressor Pipeline"
    }

@app.get("/schema", tags=["Schema"])
async def get_feature_schema():
    """
    Returns the exact machine-generated feature schema from the training pipeline.
    """
    schema = model_service.get_schema()
    if not schema:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Feature schema not available."
        )
    return schema

@app.post("/api/predict", response_model=PredictionResponse, tags=["Prediction"])
async def predict_student_score(payload: Dict[str, Any] = Body(...)):
    """
    Validates input against feature_schema.json and predicts the final exam score
    using the exact Scikit-Learn Pipeline.
    """
    try:
        return model_service.predict_dict(payload)
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(e)}"
        )

@app.post("/api/predict/batch", response_model=BatchPredictionResponse, tags=["Prediction"])
async def predict_batch_scores(payload: BatchPredictionRequest):
    """
    Calculates batch exam score predictions for a student cohort.
    """
    if not payload.students:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The student list cannot be empty."
        )
    if len(payload.students) > 1000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Batch limit exceeded (maximum 1,000 records per request)."
        )
    try:
        return model_service.predict_batch(payload.students)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch prediction error: {str(e)}"
        )

@app.post("/api/simulate", response_model=WhatIfResponse, tags=["Simulation"])
async def simulate_what_if(payload: WhatIfRequest):
    """
    Simulates academic trajectory adjustments to project score differentials.
    """
    try:
        return model_service.simulate_what_if(payload.base_student, payload.changes)
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Simulation error: {str(e)}"
        )

@app.get("/api/model-info", response_model=ModelMetadataResponse, tags=["Metadata"])
async def get_model_information():
    """
    Returns empirical coefficients, standardization parameters, and validation metrics.
    """
    return model_service.get_metadata()

@app.get("/api/benchmarks", tags=["Metadata"])
async def get_cohort_benchmarks():
    """
    Returns baseline cohort reference distribution statistics computed from 6,607 student records.
    """
    return {
        "sample_size": 6607,
        "score_distribution": {
            "mean": 67.24,
            "std": 3.89,
            "min": 55.0,
            "q25": 65.0,
            "median": 67.0,
            "q75": 69.0,
            "max": 100.0
        },
        "attendance_distribution": {
            "mean": 79.98,
            "median": 80.0,
            "min": 60.0,
            "max": 100.0
        },
        "study_hours_distribution": {
            "mean": 19.98,
            "median": 20.0,
            "min": 1.0,
            "max": 44.0
        }
    }
