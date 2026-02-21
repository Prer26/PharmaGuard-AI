from groq import Groq
import os
from dotenv import load_dotenv
import json
import re
import logging

load_dotenv()

# configure
logger = logging.getLogger(__name__)
api_key = os.getenv("GROQ_API_KEY","YOUR_GROQ_API")
client = Groq(api_key=api_key)


def _extract_json_from_text(text: str):
    # Try to find a JSON object in the text using a simple brace matcher
    try:
        # First try direct load
        return json.loads(text)
    except Exception:
        pass

    # find first {...} block
    m = re.search(r"\{[\s\S]*\}", text)
    if m:
        blob = m.group(0)
        try:
            return json.loads(blob)
        except Exception:
            logger.debug("Could not parse JSON blob from LLM response")

    return None


def generate_explanation(data):
    prompt = f"""
You are a clinical pharmacogenomics expert.

Gene: {data.get('gene')}
Phenotype: {data.get('phenotype')}
Drug: {data.get('drug')}
Risk: {data.get('risk')}

Explain mechanism and recommendation in short JSON with keys: summary, mechanism, clinical_impact, recommendation.
Return only valid JSON or a JSON block inside text.
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=512,
        )

        # defensive access — groq SDK shapes may vary
        text = None
        try:
            text = response.choices[0].message.content
        except Exception:
            try:
                text = response.choices[0].text
            except Exception:
                text = str(response)

        logger.debug(f"LLM raw response: {text}")

        parsed = _extract_json_from_text(text)
        if isinstance(parsed, dict):
            # normalize keys
            return {
                "summary": parsed.get("summary") or parsed.get("explanation") or parsed.get("description") or "",
                "mechanism": parsed.get("mechanism", ""),
                "clinical_impact": parsed.get("clinical_impact", parsed.get("impact", "")),
                "recommendation": parsed.get("recommendation", parsed.get("recommendations", parsed.get("advice", "")))
            }

        # fallback: if no JSON, return the whole text as summary
        return {"summary": text or "", "mechanism": "", "clinical_impact": "", "recommendation": ""}

    except Exception as e:
        logger.error(f"LLM request failed: {e}")
        return {
            "summary": "Explanation unavailable",
            "mechanism": "",
            "clinical_impact": "",
            "recommendation": ""

        }
