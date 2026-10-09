from typing import List, Dict, Optional, Literal, Any
from pydantic import BaseModel, Field

class StudentInput(BaseModel):
    Attendance: float = Field(default=80.0, ge=0.0, le=100.0, description="Attendance percentage (0-100%)")
    Hours_Studied: float = Field(default=20.0, ge=0.0, le=168.0, description="Study hours per week")
    Previous_Scores: float = Field(default=75.0, ge=0.0, le=100.0, description="Previous exam score (0-100)")
    Access_to_Resources: Literal["Low", "Medium", "High"] = Field(default="Medium", description="Access to educational resources")
    Parental_Involvement: Literal["Low", "Medium", "High"] = Field(default="Medium", description="Parental involvement level")
    Tutoring_Sessions: int = Field(default=1, ge=0, le=30, description="Monthly tutoring sessions attended")
    Parental_Education_Level: Literal["High School", "College", "Postgraduate"] = Field(default="College", description="Highest parental education level")
    Peer_Influence: Literal["Negative", "Neutral", "Positive"] = Field(default="Neutral", description="Peer study group influence")
    Distance_from_Home: Literal["Near", "Moderate", "Far"] = Field(default="Near", description="Commute distance from school")
    Motivation_Level: Literal["Low", "Medium", "High"] = Field(default="Medium", description="Self-reported motivation")
    Teacher_Quality: Literal["Low", "Medium", "High"] = Field(default="Medium", description="Perceived teaching quality")
    Extracurricular_Activities: Literal["No", "Yes"] = Field(default="Yes", description="Participation in school extracurriculars")
    Internet_Access: Literal["No", "Yes"] = Field(default="Yes", description="Home high-speed internet availability")
    student_id: Optional[str] = Field(default=None, description="Optional student reference ID or name")

class FeatureContribution(BaseModel):
    feature: str
    label: str
    input_value: Any
    impact_points: float
    direction: Literal["positive", "negative", "neutral"]
    description: str

class ConfidenceRange(BaseModel):
    lower_bound: float
    upper_bound: float
    confidence_level: str

class Recommendation(BaseModel):
    factor: str
    current_value: Any
    suggested_target: Any
    potential_gain: float
    action: str

class PredictionResponse(BaseModel):
    predicted_score: float
    grade_letter: str
    performance_band: str
    percentile: float
    base_score: float
    confidence_range: ConfidenceRange
    contributions: List[FeatureContribution]
    recommendations: List[Recommendation]
    student_id: Optional[str] = None

class BatchPredictionRequest(BaseModel):
    students: List[StudentInput]

class BatchPredictionSummary(BaseModel):
    total_students: int
    class_average: float
    highest_score: float
    lowest_score: float
    pass_rate: float
    grade_distribution: Dict[str, int]

class BatchPredictionResponse(BaseModel):
    summary: BatchPredictionSummary
    results: List[PredictionResponse]

class WhatIfRequest(BaseModel):
    base_student: StudentInput
    changes: Dict[str, Any]

class WhatIfResponse(BaseModel):
    original_score: float
    simulated_score: float
    score_delta: float
    grade_before: str
    grade_after: str
    attribution_changes: List[Dict[str, Any]]

class FeatureWeightInfo(BaseModel):
    feature: str
    label: str
    coefficient: float
    mean: float
    std_scale: float
    importance_rank: int
    category: str

class ModelMetadataResponse(BaseModel):
    model_name: str
    algorithm: str
    r2_score: float
    mae: float
    rmse: float
    baseline_intercept: float
    training_sample_count: int
    features: List[FeatureWeightInfo]
