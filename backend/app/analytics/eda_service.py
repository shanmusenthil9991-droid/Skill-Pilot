import os
import json
import pandas as pd
import numpy as np
from typing import Dict, Any, List
from app.config import settings

class EDAService:
    def __init__(self):
        self.dataset_path = settings.DATASET_PATH
        self._cached_eda = None

    def get_full_eda_report(self) -> Dict[str, Any]:
        if self._cached_eda is not None:
            return self._cached_eda
            
        if not os.path.exists(self.dataset_path):
            return {"error": "Dataset not found. Please run generator."}
            
        df = pd.read_csv(self.dataset_path)
        
        # 1. Dataset Scale & Storage Analysis
        dataset_scale = {
            "total_records": len(df),
            "total_features": len(df.columns),
            "memory_usage_kb": round(df.memory_usage(deep=True).sum() / 1024, 2),
            "storage_file_size_kb": round(os.path.getsize(self.dataset_path) / 1024, 2),
            "data_types": {col: str(dtype) for col, dtype in df.dtypes.items()},
            "missing_values_count": int(df.isnull().sum().sum()),
            "duplicate_records_count": int(df.duplicated().sum()),
            "scale_justification": (
                "A 5,000-record dataset provides sufficient statistical power to train complex non-linear "
                "ensemble models (Random Forest, Gradient Boosting) without overfitting, while enabling sub-second "
                "in-memory EDA computations and multi-department stratification across 8 engineering disciplines."
            )
        }
        
        # 2. Department Breakdown
        dept_counts = df["dept_code"].value_counts().to_dict()
        dept_avg_readiness = df.groupby("dept_code")["is_placement_ready"].mean().round(4).to_dict()
        dept_avg_cgpa = df.groupby("dept_code")["cgpa"].mean().round(2).to_dict()
        dept_avg_coding = df.groupby("dept_code")["programming_score"].mean().round(2).to_dict()
        dept_avg_dsa = df.groupby("dept_code")["dsa_score"].mean().round(2).to_dict()
        
        department_metrics = []
        for code, count in dept_counts.items():
            department_metrics.append({
                "dept_code": code,
                "student_count": int(count),
                "readiness_rate_pct": round(dept_avg_readiness.get(code, 0) * 100, 1),
                "avg_cgpa": dept_avg_cgpa.get(code, 0),
                "avg_coding_score": dept_avg_coding.get(code, 0),
                "avg_dsa_score": dept_avg_dsa.get(code, 0)
            })
            
        # 3. Correlation Matrix on Key Predictive Features
        corr_cols = [
            "cgpa", "programming_score", "dsa_score", "aptitude_score",
            "logical_score", "communication_score", "projects_count",
            "internships_count", "online_problems_solved", "is_placement_ready"
        ]
        corr_matrix = df[corr_cols].corr().round(3).to_dict()
        
        # 4. Feature Distributions (Histograms / Quartiles)
        distributions = {}
        for col in ["cgpa", "programming_score", "dsa_score", "aptitude_score", "online_problems_solved"]:
            hist_vals, bin_edges = np.histogram(df[col], bins=10)
            distributions[col] = {
                "min": round(float(df[col].min()), 2),
                "max": round(float(df[col].max()), 2),
                "mean": round(float(df[col].mean()), 2),
                "median": round(float(df[col].median()), 2),
                "std": round(float(df[col].std()), 2),
                "histogram": [
                    {
                        "bin_start": round(float(bin_edges[i]), 1),
                        "bin_end": round(float(bin_edges[i+1]), 1),
                        "count": int(hist_vals[i])
                    }
                    for i in range(len(hist_vals))
                ]
            }
            
        # 5. Archetype breakdown
        archetype_counts = df["archetype_id"].value_counts().to_dict()
        archetype_names = {
            "0": "High CGPA + Low Hands-on Coding",
            "1": "Avg CGPA + Elite Competitive Programmer",
            "2": "High Aptitude/Cognitive + Low Comm",
            "3": "ECE Core Enthusiast",
            "4": "ECE Software Switcher",
            "5": "Project Heavy Builder",
            "6": "Balanced High Achiever",
            "7": "Developing / Emerging Learner"
        }
        archetypes_summary = [
            {
                "id": str(k),
                "name": archetype_names.get(str(k), f"Archetype {k}"),
                "count": int(v),
                "pct": round((v / len(df)) * 100, 1)
            }
            for k, v in archetype_counts.items()
        ]

        result = {
            "dataset_scale": dataset_scale,
            "department_metrics": department_metrics,
            "correlation_matrix": corr_matrix,
            "distributions": distributions,
            "archetypes_summary": archetypes_summary,
            "overall_placement_readiness_pct": round(float(df["is_placement_ready"].mean()) * 100, 1)
        }
        self._cached_eda = result
        return result

eda_service = EDAService()
