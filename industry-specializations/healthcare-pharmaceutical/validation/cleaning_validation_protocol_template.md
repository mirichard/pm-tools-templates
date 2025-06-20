# Cleaning Validation Protocol Template

## Document Control

| Document Information | Details |
|--|--|
| **Document Title** | Cleaning Validation Protocol for [EQUIPMENT/PROCESS/FACILITY] |
| **Document Number** | CVP-[SYSTEM ID]-[SEQUENTIAL NUMBER] |
| **Version** | 1.0 |
| **Effective Date** | [EFFECTIVE DATE] |
| **Next Review Date** | [REVIEW DATE] |
| **Supersedes** | N/A (Initial Version) |

### Version History

| Version | Date | Description of Changes | Author |
|--|--|--|--|
| 1.0 | [DATE] | Initial Release | [NAME] |

### Approvals

| Role | Name | Signature | Date |
|--|--|--|--|
| **Protocol Author** | | | |
| **Quality Assurance** | | | |
| **Validation Lead** | | | |
| **Manufacturing/Operations** | | | |
| **Quality Control** | | | |

## 1. Purpose

This protocol defines the methodology, acceptance criteria, and procedures required to validate the cleaning process for [EQUIPMENT/SYSTEM] to ensure that residues are removed to acceptable levels, preventing cross-contamination between product manufacturing campaigns.

## 2. Scope

This protocol applies to the cleaning validation of [EQUIPMENT/SYSTEM] used in the manufacturing of [PRODUCTS]. The protocol covers:

- Establishment of acceptance limits based on scientific rationale
- Sampling methods and locations
- Analytical methods and their suitability
- Recovery studies
- Testing for product residues, cleaning agent residues, and bioburden
- Evaluation of results against predefined acceptance criteria

## 3. Responsibilities

| Role | Responsibilities |
|--|--|
| **Validation Team** | Planning and execution of protocol, sample collection, documentation of results |
| **Quality Control** | Sample analysis, method validation, analytical support |
| **Quality Assurance** | Protocol review and approval, oversight of validation activities, final report approval |
| **Production/Operations** | Execution of cleaning procedures according to SOPs |
| **Validation Manager** | Overall responsibility for validation program, final approval of validation documentation |

## 4. References

### 4.1 Regulatory Guidelines

- FDA Guidance for Industry: "Process Validation: General Principles and Practices" 
- EMA Guideline on setting health-based exposure limits (HBEL)
- PIC/S PI 006: "Recommendations on Validation Master Plan, Installation and Operational Qualification, Non-Sterile Process Validation, Cleaning Validation"
- ICH Q7: "Good Manufacturing Practice Guide for Active Pharmaceutical Ingredients"
- EU GMP Guidelines, Annex 15: "Qualification and Validation"

### 4.2 Internal Documents

- SOP [NUMBER]: Cleaning Procedure for [EQUIPMENT]
- SOP [NUMBER]: Sampling Methods for Cleaning Validation
- SOP [NUMBER]: Analytical Method for [RESIDUE TYPE] Detection
- [EQUIPMENT] User Manual and Drawings
- Risk Assessment Report [NUMBER]

## 5. Equipment/System Description

### 5.1 Equipment Identification

| Item | Description | Material of Construction | ID Number |
|--|--|--|--|
| [ITEM 1] | [DESCRIPTION] | [MATERIAL] | [ID] |
| [ITEM 2] | [DESCRIPTION] | [MATERIAL] | [ID] |

### 5.2 Cleaning Procedure Summary

Provide a brief description of the cleaning procedure to be validated, including:

- Manual vs. automated cleaning
- Cleaning agents used and concentrations
- Temperature and time parameters
- Rinsing steps
- Drying procedures

## 6. Health-Based Exposure Limits and Acceptance Criteria

### 6.1 Maximum Allowable Carryover (MACO) Calculation

The MACO will be calculated using the following formula:

```
MACO = (ADE or PDE × MBS) / (MDD × SF)
```

Where:
- ADE = Acceptable Daily Exposure (mg/day)
- PDE = Permitted Daily Exposure (mg/day)
- MBS = Minimum Batch Size of next product (kg)
- MDD = Maximum Daily Dose of next product (kg/day)
- SF = Safety Factor (typically 1-10)

Example calculation:
```
Given:
- ADE for Product A = 0.1 mg/day
- Minimum Batch Size of next product (Product B) = 100 kg
- Maximum Daily Dose of Product B = 0.5 g/day
- Safety Factor = 1

MACO = (0.1 mg/day × 100 kg) / (0.5 g/day × 1)
MACO = 10 mg/kg or 10 ppm
```

### 6.2 Surface Area Calculation

Surface residue limits will be calculated as:

```
Residue Limit (µg/cm²) = MACO (mg) / Total Shared Surface Area (cm²)
```

### 6.3 Acceptance Criteria

#### 6.3.1 Product Residue Limits

| Product | Calculated MACO (ppm) | Surface Limit (µg/cm²) | Swab Limit (µg/swab) | Rinse Limit (µg/mL) |
|--|--|--|--|--|
| [PRODUCT A] | [VALUE] | [VALUE] | [VALUE] | [VALUE] |
| [PRODUCT B] | [VALUE] | [VALUE] | [VALUE] | [VALUE] |

#### 6.3.2 Cleaning Agent Residue Limits

| Cleaning Agent | Limit (µg/cm²) | Swab Limit (µg/swab) | Rinse Limit (µg/mL) |
|--|--|--|--|
| [AGENT A] | [VALUE] | [VALUE] | [VALUE] |

#### 6.3.3 Microbiological Limits

| Parameter | Acceptance Criterion |
|--|--|
| Bioburden | ≤ [VALUE] CFU/100cm² |
| Endotoxin (if applicable) | ≤ [VALUE] EU/device |

#### 6.3.4 Visual Inspection

Equipment must be visually clean when inspected under appropriate lighting conditions.

## 7. Sampling Plan

### 7.1 Sampling Locations

Sampling locations have been determined based on:
- Risk assessment results
- Equipment design and construction materials
- Product contact surfaces
- Hard-to-clean areas
- Worst-case conditions

### 7.2 Sampling Locations Map

[INSERT EQUIPMENT DIAGRAM WITH NUMBERED SAMPLING POINTS]

### 7.3 Sampling Locations Table

| Location ID | Description | Rationale | Sampling Method |
|--|--|--|--|
| L1 | [DESCRIPTION] | [RATIONALE] | Swab |
| L2 | [DESCRIPTION] | [RATIONALE] | Swab |
| L3 | [DESCRIPTION] | [RATIONALE] | Rinse |

### 7.4 Control Samples

The following control samples will be collected:
- Negative controls: Unused swabs/rinse solutions
- Positive controls: Known concentration of target residue

## 8. Sampling Methods

### 8.1 Swab Sampling Procedure

1. Use [SWAB TYPE] swabs pre-wetted with [SOLVENT]
2. Swab area of [SIZE] cm² (typically 25 cm²) using the following pattern:
   - Horizontal strokes with one side of swab
   - Vertical strokes with the other side
   - Diagonal strokes with swab edge
3. Place swab in sample container with [VOLUME] mL of [RECOVERY SOLUTION]
4. Seal, label, and transport to laboratory under controlled conditions

### 8.2 Rinse Sampling Procedure

1. Collect [VOLUME] mL of final rinse solution in sterile containers
2. Ensure rinse solution contacts all product contact surfaces
3. Seal, label, and transport to laboratory under controlled conditions

## 9. Analytical Methods

### 9.1 Product Residue Analysis

| Product | Analytical Method | Method ID | LOD | LOQ | Specificity |
|--|--|--|--|--|--|
| [PRODUCT A] | [METHOD] | [ID] | [VALUE] | [VALUE] | [DETAILS] |
| [PRODUCT B] | [METHOD] | [ID] | [VALUE] | [VALUE] | [DETAILS] |

### 9.2 Cleaning Agent Analysis

| Cleaning Agent | Analytical Method | Method ID | LOD | LOQ |
|--|--|--|--|--|
| [AGENT A] | [METHOD] | [ID] | [VALUE] | [VALUE] |

### 9.3 Bioburden Analysis

| Test | Method | Method ID |
|--|--|--|
| Bioburden | [METHOD] | [ID] |
| Endotoxin (if applicable) | [METHOD] | [ID] |

### 9.4 Method Validation Reference

All analytical methods used in this protocol have been validated according to [REFERENCE DOCUMENT]. Validation parameters include:
- Specificity/selectivity
- Linearity
- Range
- Accuracy
- Precision
- Limit of detection (LOD)
- Limit of quantitation (LOQ)
- Robustness

## 10. Recovery Studies

### 10.1 Recovery Study Design

Recovery studies will be performed to determine the efficiency of the sampling method to recover residues from equipment surfaces:

1. Apply known amounts of each target residue to coupons of the same material as the equipment
2. Allow to dry under controlled conditions
3. Sample using the same swab/rinse procedures as described in Section 8
4. Analyze using validated methods
5. Calculate recovery factor as:
   ```
   Recovery Factor = (Amount Recovered / Amount Applied) × 100%
   ```

### 10.2 Recovery Acceptance Criteria

- Recovery factor must be ≥ [VALUE]% (typically ≥70%)
- Relative standard deviation (RSD) ≤ [VALUE]% (typically ≤15%)

### 10.3 Correction Factor Application

If recovery is less than 100%, a correction factor will be applied to all sample results:
```
Corrected Result = Analytical Result / Recovery Factor
```

## 11. Validation Strategy

### 11.1 Worst-Case Conditions

Cleaning validation will be performed under worst-case conditions:
- Most difficult-to-clean product
- Maximum soil load conditions
- Maximum time between end of production and cleaning
- Minimum cleaning parameters (time, temperature, concentration)

### 11.2 Number of Validation Runs

[NUMBER] consecutive successful cleaning validation runs will be performed to demonstrate consistency and reproducibility of the cleaning process.

## 12. Execution Procedure

### 12.1 Pre-Validation Requirements

- Equipment is in qualified state
- Cleaning procedure is approved and in effect
- Analytical methods are validated
- Recovery studies are completed
- Personnel are trained on protocol requirements

### 12.2 Validation Execution Steps

1. Manufacture [PRODUCT] according to standard procedures
2. Allow equipment to stand for [TIME] (worst-case dirty hold time)
3. Clean equipment according to SOP [NUMBER]
4. Perform visual inspection
5. Collect samples according to sampling plan
6. Analyze samples using validated methods
7. Document results

## 13. Data Analysis and Evaluation

### 13.1 Data Review

All data will be reviewed for:
- Completeness
- Accuracy
- Compliance with acceptance criteria
- Trends or patterns

### 13.2 Statistical Analysis

The following statistical analyses will be performed:
- Mean, standard deviation, and RSD for each sampling location across runs
- Evaluation of data distribution
- Confidence intervals

## 14. Acceptance Criteria for Validation

The cleaning validation will be considered successful if:

1. All visual inspections confirm equipment is visually clean
2. All residue levels are below established limits after correction for recovery
3. All bioburden/endotoxin levels meet acceptance criteria
4. All [NUMBER] consecutive runs meet criteria consistently

## 15. Deviations and Investigations

Any deviations from this protocol or failure to meet acceptance criteria will be documented and investigated according to SOP [NUMBER]. Corrective and preventive actions will be implemented as needed.

## 16. Revalidation Criteria

Cleaning validation will be repeated under the following circumstances:
- Significant changes to equipment
- Changes in cleaning procedure or agents
- Changes in products manufactured
- Based on ongoing monitoring results
- Per periodic review requirements (at least every [NUMBER] years)

## 17. Documentation and Reporting

The following documentation will be generated:
- Completed protocol with all data
- Analytical test results
- Deviation reports (if applicable)
- Validation summary report

## 18. Attachments

- Attachment 1: Equipment Drawings with Sampling Locations
- Attachment 2: Analytical Method Summaries
- Attachment 3: Recovery Study Results
- Attachment 4: Sampling Forms
- Attachment 5: MACO Calculation Worksheet

## 19. Glossary

| Term | Definition |
|--|--|
| ADE | Acceptable Daily Exposure |
| MACO | Maximum Allowable Carryover |
| PDE | Permitted Daily Exposure |
| LOD | Limit of Detection |
| LOQ | Limit of Quantitation |

# Cleaning Validation Protocol Template

**Protocol Number:** [CV-XXXX]  
**Version:** [1.0]  
**Effective Date:** [YYYY-MM-DD]  
**Supersedes:** [N/A or previous version]

## 1. Document Control

### 1.1 Version History

| Version | Date | Description of Changes | Author | Reviewed By | Approved By |
|---------|------|------------------------|--------|-------------|-------------|
| 1.0 | YYYY-MM-DD | Initial release | [Name] | [Name] | [Name] |

### 1.2 Distribution List

| Name | Department/Role | Date Distributed |
|------|----------------|------------------|
| [Name] | Quality Assurance | YYYY-MM-DD |
| [Name] | Manufacturing | YYYY-MM-DD |
| [Name] | Validation | YYYY-MM-DD |
| [Name] | Regulatory Affairs | YYYY-MM-DD |

### 1.3 Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Protocol Author | [Name] | _____________ | YYYY-MM-DD |
| Quality Assurance | [Name] | _____________ | YYYY-MM-DD |
| Production Manager | [Name] | _____________ | YYYY-MM-DD |
| Validation Manager | [Name] | _____________ | YYYY-MM-DD |
| Quality Control | [Name] | _____________ | YYYY-MM-DD |

## 2. Introduction

### 2.1 Purpose

This protocol establishes the procedures and acceptance criteria for validating the cleaning process for [Equipment Name/ID] used in the manufacture of [Product(s)]. This validation will demonstrate that the cleaning procedure consistently removes product residues, cleaning agents, and potential microbial contaminants to acceptable levels, ensuring the prevention of cross-contamination between manufacturing batches.

### 2.2 Scope

This validation protocol applies to:

- Equipment: [Specify equipment name, model, ID number]
- Manufacturing Area: [Specify area/room number]
- Products: [List products manufactured using this equipment]
- Cleaning Procedure: [Reference SOP number]

The cleaning validation will include:
- Assessment of visual cleanliness
- Chemical analysis of product residues
- Bioburden/microbial testing (if applicable)
- Cleaning agent residue testing
- Establishment of validated clean hold times

### 2.3 Regulatory Requirements

This cleaning validation protocol has been developed in accordance with:

- FDA Guidance for Industry: Process Validation: General Principles and Practices
- EMA Guideline on setting health based exposure limits
- 21 CFR Part 211.67 - Equipment cleaning and maintenance
- ICH Q7 Good Manufacturing Practice Guide for Active Pharmaceutical Ingredients
- PIC/S Guide to Good Manufacturing Practice for Medicinal Products (PE 009)
- USP <1072> Disinfectants and Antiseptics

## 3. Equipment and Process Description

### 3.1 Equipment Details

| Item | Description |
|------|-------------|
| Equipment Name | [e.g., Tablet Press, Reactor Vessel] |
| Model Number | [Model #] |
| Serial Number | [Serial #] |
| Asset/ID Number | [Asset ID #] |
| Location | [Building/Room] |
| Capacity/Size | [e.g., 200L, 500kg] |
| Construction Material | [e.g., 316L Stainless Steel, Glass-lined steel] |
| Surface Area | [Total surface area calculation] |
| Critical Surfaces | [List all product-contact surfaces] |
| Difficult-to-Clean Areas | [List areas requiring special attention] |

**Equipment Diagram:** [Reference to equipment diagram in Appendix]

### 3.2 Cleaning Process Description

**Cleaning SOP Reference:** [SOP-XXX-YYY]

#### 3.2.1 Manual Cleaning Steps
1. Disassembly of equipment components
2. Gross soil removal (rinse with [Water Type] for [Time])
3. Application of [Detergent Name] at [Concentration]% for [Time]
4. Scrubbing of surfaces with [Tool Type]
5. Rinse with [Water Type] for [Time]
6. Final rinse with [WFI/Purified Water] for [Time]
7. Drying using [Method] for [Time]

#### 3.2.2 Automated/CIP Cleaning Steps (if applicable)
1. Pre-rinse: [Water Type] at [Temperature]°C for [Time]
2. Detergent wash: [Detergent] at [Concentration]% at [Temperature]°C for [Time]
3. Post-detergent rinse: [Water Type] at [Temperature]°C for [Time]
4. [Optional sanitization step]
5. Final rinse: [WFI/Purified Water] at [Temperature]°C for [Time]
6. Air blow/drying: [Time] at [Temperature]°C

### 3.3 Cleaning Agents

| Cleaning Agent | Composition | Concentration | Contact Time | Supplier | Lot Number | Expiry Date |
|----------------|-------------|---------------|--------------|----------|------------|-------------|
| [Detergent Name] | [Active ingredients] | [X]% v/v or w/v | [Time] | [Supplier] | [For reference] | [For reference] |
| [Sanitizer Name] | [Active ingredients] | [X]% v/v or w/v | [Time] | [Supplier] | [For reference] | [For reference] |

**Safety Information:**
- Toxicity data: [Specify LD50 or other relevant toxicity data]
- Recommended PPE: [List required personal protective equipment]
- Disposal requirements: [Specify waste disposal procedures]

## 4. Validation Strategy

### 4.1 Worst-Case Scenarios

#### 4.1.1 Worst-Case Product Selection
[Product Name] has been selected as the worst-case product based on the following criteria:
- Solubility: [Least soluble/Most difficult to clean]
- Potency: [Highest potency/Lowest therapeutic dose]
- Toxicity: [Highest toxicity]
- Physical characteristics: [Most difficult physical properties, e.g., viscosity, adherence]

#### 4.1.2 Worst-Case Equipment Conditions
- Maximum soil load: [Describe maximum product residue expected]
- Maximum operating time: [Longest production run time]
- Minimum cleaning agent concentration: [Lowest effective concentration]
- Minimum cleaning time: [Shortest effective cleaning time]
- Longest dirty hold time: [Maximum time between production end and cleaning start]

### 4.2 Sampling Locations

A total of [X] sampling locations have been identified based on:
- Direct product contact surfaces
- Difficult-to-clean areas
- Flow path/product stream
- Representative sampling of total surface area

| Location ID | Description | Rationale | Sampling Method |
|-------------|-------------|-----------|----------------|
| L1 | [e.g., Interior vessel bottom] | [e.g., Potential pooling point] | [Swab/Rinse] |
| L2 | [e.g., Agitator shaft] | [e.g., Difficult geometry, product contact] | [Swab/Rinse] |
| L3 | [e.g., Discharge valve] | [e.g., Product flow restriction point] | [Swab/Rinse] |
| ... | ... | ... | ... |

**Sampling Locations Diagram:** [Reference to diagram in Appendix]

### 4.3 Acceptance Criteria

#### 4.3.1 Visual Inspection
- All accessible product-contact surfaces must be visibly clean when inspected under [specify lighting conditions, e.g., 500 lux minimum]
- No visible residue, film, or discoloration

#### 4.3.2 Chemical Residue Limits
Limits for active pharmaceutical ingredient (API) and cleaning agents are established based on:

**For API residue:**
- Maximum Allowable Carryover (MAC) = (Minimum Daily Dose of Previous Product × Safety Factor) / Maximum Daily Dose of Next Product
- Limit in terms of concentration = MAC / Minimum Batch Size of Next Product
- Limit per surface area = Limit in terms of concentration × Minimum Batch Size / Total Shared Surface Area

**Example calculation:**
- Safety factor: 0.001 (1/1000)
- Minimum daily dose of previous product (Product A): 10 mg
- Maximum daily dose of next product (Product B): 100 mg
- Minimum batch size of Product B: 100 kg
- Total shared surface area: 5 m²

MAC = (10 mg × 0.001) / 100 mg = 0.0001 mg/mg = 0.1 μg/mg
Limit in terms of concentration = 0.1 μg/mg × 1,000,000 mg/kg = 100,000 μg/kg
Limit per surface area = 100,000 μg/kg × 100 kg / 5 m² = 2,000,000 μg/m² = 2 mg/m² = 2 μg/cm²

**For cleaning agent residue:**
- Based on supplier recommendations, toxicological data, and regulatory guidelines
- Typically 10 ppm or lower

#### 4.3.3 Microbiological Limits (if applicable)
- Total aerobic microbial count (TAMC): ≤ 100 CFU/100cm²
- Total yeast and mold count (TYMC): ≤ 10 CFU/100cm²
- Absence of specified organisms (e.g., E. coli, Salmonella, Pseudomonas aeruginosa, Staphylococcus aureus)

#### 4.3.4 Recovery Study Acceptance Criteria
- Recovery factor must be ≥ 70% for swab methods
- Relative standard deviation (RSD) of recovery samples must be ≤ 15%

## 5. Test Procedures

### 5.1 Visual Inspection

#### 5.1.1 Materials
- Flashlight or other portable light source (minimum 500 lux)
- Inspection mirror for difficult-to-reach areas
- Clean, lint-free gloves
- Inspection checklist

#### 5.1.2 Procedure
1. Don appropriate PPE including clean gloves
2. Ensure adequate lighting conditions (minimum 500 lux)
3. Visually inspect all accessible product-contact surfaces
4. Use inspection mirror for difficult-to-access areas
5. Document observations on inspection form
6. Take photographs if any residue is observed

#### 5.1.3 Acceptance Criteria
- All surfaces must be visibly clean
- No visible residue, film, or discoloration
- No evidence of moisture (unless specified in procedure)

### 5.2 Swab Analysis

#### 5.2.1 Materials
- Pre-moistened swabs [Specify type, e.g., polyester or cotton]
- Swab templates (typically 25 cm², 10 cm × 10 cm, or 5 cm × 5 cm)
- Sample containers [Specify type]
- Extraction solvent [Specify solvent]
- PPE (powder-free gloves, lab coat, etc.)
- Swabbing procedure SOP [Reference number]

#### 5.2.2 Procedure
1. Don appropriate PPE
2. Place template on sampling location
3. Remove swab from packaging and moisten with appropriate solvent (if not pre-moistened)
4. Swab the defined area using parallel strokes while rotating the swab
5. Swab the same area using strokes perpendicular to the first set
6. Swab the same area using diagonal strokes
7. Break swab tip into sample container with extraction solvent
8. Seal, label, and transfer samples to laboratory
9. Extract and analyze according to analytical method

#### 5.2.3 Acceptance Criteria
Results must be below the established limits for:
- Active pharmaceutical ingredient: ≤ [X] μg/cm²
- Cleaning agent: ≤ [X] μg/cm² or ≤ 10 ppm in next batch
- Microbiological limits (if applicable): ≤ 100 CFU/100cm²

### 5.3 Rinse Analysis

#### 5.3.1 Materials
- Sterile collection vessels
- Final rinse water (WFI or Purified Water)
- Rinse sampling procedure SOP [Reference number]

#### 5.3.2 Procedure
1. Collect [X] mL of final rinse water at [specify points in the cleaning process]
2. Seal, label, and transfer samples to laboratory
3. Analyze according to analytical method

#### 5.3.3 Acceptance Criteria
Results must be below the established limits for:
- Active pharmaceutical ingredient: ≤ [X] μg/mL or ≤ [X] ppm
- Cleaning agent: ≤ [X] μg/mL or ≤ 10 ppm
- Conductivity: ≤ [X] μS/cm
- TOC (if applicable): ≤ [X] ppm
- pH (if applicable): [X.X - Y.Y]

### 5.4 Recovery Studies

#### 5.4.1 Materials
- Clean coupons of the same material as equipment surfaces
- Standard solutions of target analytes
- Swabbing materials as specified in 5.2.1
- Analytical method validation protocol [Reference number]

#### 5.4.2 Procedure
1. Prepare standard solutions of known concentrations
2. Apply known amounts to clean coupons
3. Allow to dry for specified time (simulating worst-case scenario)
4. Perform swabbing using identical procedure as for actual samples
5. Analyze samples and calculate recovery percentage

#### 5.4.3 Acceptance Criteria
- Recovery factor must be ≥ 70% for swab methods
- Relative standard deviation (RSD) of recovery samples must be ≤ 15%
- Analytical method must be validated according to ICH Q2(R1) guidelines

## 6. Analytical Methods

### 6.1 Active Pharmaceutical Ingredient Analysis

**Method Reference:** [SOP/Method Number]

| Parameter | Description |
|-----------|-------------|
| Analytical Technique | [e.g., HPLC, UV-Vis, TOC] |
| Equipment | [Model and manufacturer] |
| Column (if applicable) | [Type, dimensions] |
| Mobile Phase (if applicable) | [Composition] |
| Flow Rate (if applicable) | [X.X mL/min] |
| Detection | [Wavelength, detector type] |
| Limit of Detection (LOD) | [X.X μg/mL] |
| Limit of Quantitation (LOQ) | [X.X μg/mL] |
| Linearity Range | [X.X - Y.Y μg/mL] |
| Sample Preparation | [Brief description] |

### 6.2 Cleaning Agent Analysis

**Method Reference:** [SOP/Method Number]

| Parameter | Description |
|-----------|-------------|
| Analytical Technique | [e.g., Conductivity, pH, specific assay] |
| Equipment | [Model and manufacturer] |
| Reagents | [List of reagents] |
| Limit of Detection (LOD) | [X.X μg/mL] |
| Limit of Quantitation (LOQ) | [X.X μg/mL] |
| Linearity Range | [X.X - Y.Y μg/mL] |
| Sample Preparation | [Brief description] |

### 6.3 Microbiological Analysis (if applicable)

**Method Reference:** [SOP/Method Number]

| Parameter | Description |
|-----------|-------------|
| Method | [e.g., Pour plate, membrane filtration] |
| Media | [e.g., TSA, SDA] |
| Incubation Conditions | [Temperature, time] |
| Sample Preparation | [Brief description] |

## 7. Sampling Plans

### 7.1 Validation Runs

A minimum of three consecutive successful validation runs will be performed.

| Run | Product | Date | Equipment Condition | Sampling Points |
|-----|---------|------|---------------------|----------------|
| 1 | [Product] | [Planned Date] | [Post-production] | All designated locations |
| 2 | [Product] | [Planned Date] | [Post-production] | All designated locations |
| 3 | [Product] | [Planned Date] | [Post-production] | All designated locations |

### 7.2 Clean Hold Time Study (if applicable)

Equipment will be cleaned according to the procedure and held for the maximum proposed clean hold time before sampling.

| Run | Clean Hold Time | Sampling Points | Testing Required |
|-----|----------------|-----------------|------------------|
| 1 | [X hours/days] | All designated locations | Visual, chemical, microbial |

### 7.3 Dirty Hold Time Study (if applicable)

Equipment will be left dirty for the maximum proposed dirty hold time before cleaning and sampling.

| Run | Dirty Hold Time | Sampling Points | Testing Required |
|-----|----------------|-----------------|------------------|
| 1 | [X hours/days] | All designated locations | Visual, chemical, microbial |

## 8. Acceptance Criteria

### 8.1 Summary of Acceptance Criteria

| Test | Acceptance Criteria | Rationale |
|------|---------------------|-----------|
| Visual Inspection | No visible residue | Confirms basic cleanliness |
| API Residue | ≤ [X] μg/cm² or ≤ [X] ppm in next batch | Based on health-based exposure limit calculation |
| Cleaning Agent Residue | ≤ [X] μg/cm² or ≤ 10 ppm in next batch | Based on supplier recommendations and toxicological data |
| Bioburden (if applicable) | ≤ 100 CFU/100cm² | Industry standard for clean equipment |
| Conductivity (if applicable) | ≤ [X] μS/cm | Indicates removal of ionic substances |
| TOC (if applicable) | ≤ [X] ppm | Indicates removal of organic materials |

### 8.2 Validation Acceptance

The cleaning process will be considered validated when:
1. All three consecutive validation runs meet all acceptance criteria
2. Clean hold time study meets all acceptance criteria (if applicable)
3. Dirty hold time study meets all acceptance criteria (if applicable)
4. All deviations are documented, investigated, and closed

## 9. Data Collection Forms

### 9.1 Visual Inspection Form

| Equipment: | ID/Serial Number: | Date: |
|------------|-------------------|-------|
| **Inspector:** | | **Time:** |

| Location ID | Location Description | Visibly Clean? (Y/N) | Observations | Photo Reference (if applicable) |
|-------------|----------------------|----------------------|--------------|--------------------------------|
| L1 | | | | |
| L2 | | | | |
| ... | | | | |

**Result:** □ Pass □ Fail

**Inspector Signature:** _________________________ **Date:** __________

### 9.2 Swab Sample Collection Form

| Equipment: | ID/Serial Number: | Date: |
|------------|-------------------|-------|
| **Sampler:** | | **Time:** |

| Sample ID | Location ID | Surface Area (cm²) | Swab Type | Extraction Solvent | Observations |
|-----------|-------------|---------------------|-----------|---------------------|--------------|
| S1 | L1 | | | | |
| S2 | L2 | | | | |
| ... | ... | | | | |

**Sampler Signature:** _________________________ **Date:** __________

### 9.3 Rinse Sample Collection Form

| Equipment: | ID/Serial Number: | Date: |
|------------|-------------------|-------|
| **Sampler:** | | **Time:** |

| Sample ID | Collection Point | Volume Collected (mL) | Container Type | Observations |
|-----------|------------------|----------------------|----------------|--------------|
| R1 | | | | |
| R2 | | | | |
| ... | | | | |

**Sampler Signature:** _________________________ **Date:** __________

### 9.4 Analytical Results Form

| Equipment: | ID/Serial Number: | Run Number: |
|------------|-------------------|-------------|
| **Analyst:** | | **Date:** |

| Sample ID | Test | Result | Specification | Result (Pass/Fail) |
|-----------|------|--------|---------------|---------------------|
| | | | | |
| | | | | |
| ... | | | | |

**Analyst Signature:** _________________________ **Date:** __________

**Reviewer Signature:** ________________________ **Date:** __________

## 10. Results Analysis

### 10.1 Data Analysis Requirements

For each validation run, the following analysis will be performed:
1. Compilation of all visual inspection results
2. Calculation of API residue per surface area or per batch
3. Calculation of cleaning agent residue per surface area or per batch
4. Statistical analysis of results (mean, standard deviation, %RSD)
5. Comparison to acceptance criteria
6. Trend analysis across all runs

### 10.2 Results Summary Table

| Test Parameter | Run 1 Results | Run 2 Results | Run 3 Results | Acceptance Criteria | Overall Result |
|----------------|---------------|---------------|---------------|---------------------|---------------|
| Visual Inspection | | | | No visible residue | |
| API Residue | | | | ≤ [X] μg/cm² | |
| Cleaning Agent Residue | | | | ≤ [X] μg/cm² | |
| Bioburden (if applicable) | | | | ≤ 100 CFU/100cm² | |
| ... | | | | | |

### 10.3 Statistical Analysis

| Parameter | Mean | Standard Deviation | %RSD | Acceptance Criteria | Result |
|-----------|------|-------------------|----|---------------------|--------|
| API Recovery | | | | %RSD ≤ 15% | |
| API Residue | | | | %RSD ≤ 15% | |
| Cleaning Agent Residue | | | | %RSD ≤ 15% | |
| ... | | | | | |

## 11. Deviation Management

### 11.1 Deviation Documentation

| Deviation ID | Description | Run/Date | Impact Assessment | CAPA Required (Y/N) | CAPA Reference |
|--------------|-------------|----------|--------------------|----------------------|----------------|
| | | | | | |
| | | | | | |

### 11.2 Deviation Assessment Guidelines

1. **Minor Deviation:** Does not impact product quality or cleaning validation conclusions
   - Example: Documentation error with no impact on data integrity
   - Action: Document, correct, continue validation

2. **Major Deviation:** May impact product quality or cleaning validation conclusions
   - Example: Out-of-specification result, procedural error affecting sample integrity
   - Action: Document, investigate, implement CAPA, assess need for additional validation runs

3. **Critical Deviation:** Directly impacts product quality or invalidates cleaning validation
   - Example: Use of incorrect cleaning procedure, analytical method failure
   - Action: Document, investigate, implement CAPA, repeat validation run

## 12. Approval Section

### 12.1 Protocol Execution Verification

We, the undersigned, verify that this cleaning validation protocol has been executed according to the approved procedures, and all data has been recorded accurately and completely.

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Protocol Executor | [Name] | _____________ | YYYY-MM-DD |
| Quality Assurance | [Name] | _____________ | YYYY-MM-DD |

### 12.2 Final Report Approval

We, the undersigned, have reviewed the cleaning validation data and results and:

**□ Approve - The cleaning process is validated**
**□ Do Not Approve - The cleaning process requires modification and revalidation**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Validation Manager | [Name] | _____________ | YYYY-MM-DD |
| Quality Assurance Manager | [Name] | _____________ | YYYY-MM-DD |
| Production Manager | [Name] | _____________ | YYYY-MM-DD |
| Quality Control Manager | [Name] | _____________ | YYYY-MM-DD |

## 13. Appendices

### Appendix A: Equipment Diagrams with Sampling Locations

[Insert diagrams or reference to attached documents]

### Appendix B: Analytical Method Validation Summary

[Insert summary or reference to attached documents]

### Appendix C: Recovery Study Results

[Insert results or reference to attached documents]

### Appendix D: Raw Data and Calculations

[Insert data or reference to attached documents]

### Appendix E: Relevant SOPs and Reference Documents

| Document Number | Title | Version/Revision | Effective Date |
|-----------------|-------|------------------|----------------|
| SOP-XXX-YYY | Equipment Cleaning Procedure | | |
| SOP-XXX-YYY | Sampling Procedure | | |
| SOP-XXX-YYY | Analytical Method for API | | |
| SOP-XXX-YYY | Analytical Method for Cleaning Agent | | |
| SOP-XXX-YYY | Visual Inspection Procedure | | |

### Appendix F: Revalidation Requirements

The cleaning process shall be revalidated under the following circumstances:

1. **Changes to the Cleaning Process:**
   - Modification of cleaning procedures
   - Changes in cleaning agent type or concentration
   - Significant changes in cleaning parameters (time, temperature, pressure)
   - Changes in cleaning equipment

2. **Changes to the Product:**
   - Introduction of new products on the same equipment
   - Significant formulation changes to existing products
   - Changes in product dosage strength

3. **Equipment Changes:**
   - Major equipment repairs or modifications
   - Replacement of critical components that contact product
   - Relocation of equipment to a different facility

4. **Periodic Revalidation:**
   - Annual review of cleaning validation status
   - Full revalidation every [X] years
   - After [X] number of cleaning cycles

5. **After Cleaning Failures:**
   - Following repeated cleaning failures
   - After investigation of product quality issues related to cleaning

The scope of revalidation may be limited to specific aspects affected by the change, based on a documented risk assessment approved by Quality Assurance.

---

**End of Cleaning Validation Protocol**
