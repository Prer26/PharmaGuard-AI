def analyze_variants(variants, drug):

    # DEFAULT
    result = {
        "risk": "Safe",
        "severity": "none",
        "gene": "N/A",
        "diplotype": "N/A",
        "phenotype": "NM",
        "variants": variants,
        "recommendation": "Standard dosing"
    }

    for v in variants:
        gene = v.get("gene")
        star = v.get("star")

        # -------------------
        # CODEINE
        # -------------------
        if drug == "CODEINE" and gene == "CYP2D6":
            if star == "*4":
                return {
                    "risk": "Ineffective",
                    "severity": "high",
                    "gene": "CYP2D6",
                    "diplotype": "*4/*4",
                    "phenotype": "PM",
                    "variants": variants,
                    "recommendation": "Avoid codeine"
                }

        # -------------------
        # CLOPIDOGREL
        # -------------------
        if drug == "CLOPIDOGREL" and gene == "CYP2C19":
            if star == "*2":
                return {
                    "risk": "Ineffective",
                    "severity": "high",
                    "gene": "CYP2C19",
                    "diplotype": "*2/*2",
                    "phenotype": "PM",
                    "variants": variants,
                    "recommendation": "Use alternative drug"
                }

    return result