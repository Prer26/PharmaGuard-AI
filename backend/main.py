from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import logging

from vcf_parser import parse_vcf   # FIXED typo
from rule_engine import analyze_variants
from llm_engine import generate_explanation

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="PharmaGuard API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HEALTH CHECK (no more 404)
@app.get("/")
def home():
    return {"message": "PharmaGuard API running 🚀"}


@app.post("/analyze")
async def analyze(file: UploadFile, drug: str = Form(...)):
    try:
        logger.info(f"Request: file={file.filename}, drug={drug}")

        # -------------------------------
        # INPUT VALIDATION
        # -------------------------------
        if file is None:
            return {"error": "No file uploaded"}

        drug = drug.strip()
        if not drug:
            return {"error": "Drug parameter is required"}

        # MULTI DRUG SUPPORT 🔥
        drugs = [d.strip().upper() for d in drug.split(",") if d.strip()]

        # -------------------------------
        # FILE READ
        # -------------------------------
        content = await file.read()
        logger.info(f"File size: {len(content)} bytes")

        if len(content) == 0:
            return {"error": "Empty file uploaded"}

        # SAFE DECODE
        try:
            text = content.decode("utf-8")
        except:
            text = content.decode("latin-1")

        lines = text.split("\n")

        # -------------------------------
        # VCF PARSING
        # -------------------------------
        try:
            variants = parse_vcf(lines)
            logger.info(f"Parsed variants: {variants}")
        except Exception as e:
            logger.error(f"VCF parsing failed: {e}")
            return {"error": f"VCF parsing failed: {str(e)}"}

        if len(variants) == 0:
            logger.warning("No relevant variants found")

        def calculate_confidence(num_variants: int) -> float:
            if num_variants == 0:
                return 0.75
            if num_variants == 1:
                return 0.88
            return 0.95

        def normalize_risk_level(risk_label: str, severity: str) -> str:
            """Map risk label and severity to frontend risk level"""
            risk_lower = risk_label.lower()
            if "safe" in risk_lower:
                return "low"
            if "toxic" in risk_lower or "overdose" in risk_lower:
                return "high"
            if "caution" in risk_lower or "adjust" in risk_lower:
                return "medium"
            # fallback to severity
            if severity == "high":
                return "high"
            if severity == "moderate":
                return "medium"
            return "low"

        results = []

        # -------------------------------
        # PROCESS EACH DRUG
        # -------------------------------
        for d in drugs:
            try:
                analysis = analyze_variants(variants, d)
                analysis["drug"] = d

                # LLM
                try:
                    explanation = generate_explanation(analysis)
                except Exception as e:
                    logger.error(f"LLM error: {e}")
                    explanation = {
                        "summary": "LLM unavailable",
                        "mechanism": "",
                        "clinical_impact": "",
                        "recommendation": analysis.get("recommendation", "")
                    }

                # dynamic confidence based on detected variants
                confidence = calculate_confidence(len(variants))

                # normalize risk level for frontend
                risk_level = normalize_risk_level(analysis.get("risk", ""), analysis.get("severity", "low"))

                result = {
                    "patient_id": "PATIENT_001",
                    "drug": d,
                    "timestamp": datetime.utcnow().isoformat(),

                    "risk_assessment": {
                        "risk_label": analysis.get("risk", "Unknown"),
                        "confidence_score": confidence,
                        "severity": risk_level
                    },

                    "pharmacogenomic_profile": {
                        "primary_gene": analysis.get("gene", "N/A"),
                        "diplotype": analysis.get("diplotype", "N/A"),
                        "phenotype": analysis.get("phenotype", "Unknown"),
                        "detected_variants": [
                            {
                                "gene": v.get("gene"),
                                "rsid": v.get("rsid")
                            }
                            for v in analysis.get("variants", [])
                        ]
                    },

                    "clinical_recommendation": {
                        "action": analysis.get("recommendation", ""),
                        "guideline": "CPIC"
                    },

                    "llm_generated_explanation": explanation,

                    "quality_metrics": {
                        "vcf_parsing_success": True,
                        "variants_detected": len(variants)
                    }
                }

                results.append(result)

            except Exception as e:
                logger.error(f"Error processing drug {d}: {e}")

        logger.info("Analysis completed successfully")

        # -------------------------------
        # RETURN SINGLE OR MULTIPLE
        # -------------------------------
        if len(results) == 1:
            return results[0]

        return {
            "patient_id": "PATIENT_001",
            "multi_drug_analysis": True,
            "results": results
        }

    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        return {"error": f"Internal server error: {str(e)}"}