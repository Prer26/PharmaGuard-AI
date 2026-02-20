def analyze_variants(variants, drug):

    # Default - Safe for normal metabolizers
    result = {
        "gene": "N/A",
        "diplotype": "*1/*1",
        "phenotype": "Normal Metabolizer",
        "risk": "Safe",
        "severity": "low",
        "recommendation": "Standard dosing recommended",
        "variants": []
    }

    for v in variants:

        gene = v["gene"]
        rsid = v["rsid"]

        # ========== CYP2C19 COMBINATIONS ==========
        
        # CYP2C19 + CLOPIDOGREL (poor metabolizer = ineffective)
        if gene == "CYP2C19" and drug == "CLOPIDOGREL":
            if rsid == "rs4244285":
                result.update({
                    "gene": gene,
                    "diplotype": "*2/*2",
                    "phenotype": "Poor Metabolizer",
                    "risk": "Toxic - Ineffective Drug",
                    "severity": "high",
                    "recommendation": "Use alternative: prasugrel or ticagrelor",
                    "variants": [v]
                })

        # CYP2C19 + ESCITALOPRAM/CITALOPRAM (poor metabolizer = high drug levels)
        if gene == "CYP2C19" and drug in ["ESCITALOPRAM", "CITALOPRAM"]:
            if rsid == "rs4244285":
                result.update({
                    "gene": gene,
                    "diplotype": "*2/*2",
                    "phenotype": "Poor Metabolizer",
                    "risk": "Toxic - High Drug Levels",
                    "severity": "high",
                    "recommendation": "Use 50% reduced dose or switch to sertraline/paroxetine",
                    "variants": [v]
                })

        # ========== CYP2C9 COMBINATIONS ==========
        
        # CYP2C9 + WARFARIN (poor metabolizer = bleeding risk)
        if gene == "CYP2C9" and drug == "WARFARIN":
            if rsid == "rs1799853":
                result.update({
                    "gene": gene,
                    "diplotype": "*1/*3",
                    "phenotype": "Intermediate Metabolizer",
                    "risk": "Caution - Dose Adjustment Needed",
                    "severity": "moderate",
                    "recommendation": "Reduce dose 30-50% and monitor INR closely",
                    "variants": [v]
                })

        # ========== CYP2D6 COMBINATIONS ==========
        
        # CYP2D6 + CODEINE (ultra-rapid metabolizer = morphine overdose risk)
        if gene == "CYP2D6" and drug == "CODEINE":
            if rsid in ["rs3892097", "rs16947", "CYP2D6_DUP"]:
                result.update({
                    "gene": gene,
                    "diplotype": "*1/*1xN",
                    "phenotype": "Ultra-Rapid Metabolizer",
                    "risk": "Toxic - Morphine Overdose Risk",
                    "severity": "high",
                    "recommendation": "AVOID codeine; use acetaminophen, NSAIDs, or tramadol",
                    "variants": [v]
                })

        # CYP2D6 + METOPROLOL (poor metabolizer = reduced efficacy)
        if gene == "CYP2D6" and drug == "METOPROLOL":
            if rsid in ["rs3892097", "rs16947"]:
                result.update({
                    "gene": gene,
                    "diplotype": "*3/*4",
                    "phenotype": "Poor Metabolizer",
                    "risk": "Caution - Reduced Efficacy",
                    "severity": "moderate",
                    "recommendation": "Monitor BP and HR; may need higher dose or alternative beta-blocker",
                    "variants": [v]
                })

        # ========== CYP3A4 COMBINATIONS ==========
        
        # CYP3A4 + SIMVASTATIN (reduced metabolism = muscle/kidney toxicity)
        if gene == "CYP3A4" and drug == "SIMVASTATIN":
            if rsid in ["rs35599367", "rs2740574"]:
                result.update({
                    "gene": gene,
                    "diplotype": "*2/*3",
                    "phenotype": "Reduced Metabolizer",
                    "risk": "Toxic - Muscle/Kidney Damage Risk",
                    "severity": "high",
                    "recommendation": "Use pravastatin or rosuvastatin (not metabolized by CYP3A4)",
                    "variants": [v]
                })

        # ========== TPMT COMBINATIONS ==========
        
        # TPMT + AZATHIOPRINE (poor metabolizer = bone marrow toxicity)
        if gene == "TPMT" and drug == "AZATHIOPRINE":
            if rsid in ["rs1800462", "rs1800460"]:
                result.update({
                    "gene": gene,
                    "diplotype": "*2/*3",
                    "phenotype": "Poor Metabolizer",
                    "risk": "Toxic - Bone Marrow Suppression",
                    "severity": "high",
                    "recommendation": "Reduce dose to 1/10 standard or use alternative immunosuppressant",
                    "variants": [v]
                })

    return result