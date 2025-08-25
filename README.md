# Procurli Take Home Task — Email to PO Matcher

## Intro

This project is a solution for the Procurli take-home task, simulating a real-world procurement automation scenario.  
The objective is to **match unstructured email communications to purchase orders (POs) from an ERP system**, producing a table of matches with confidence scores and reasoning.

---

## Table of Contents

- [Overview](#overview)
- [How to Run (with Docker)](#how-to-run-with-docker)
- [How to Run Locally (Node.js)](#how-to-run-locally-nodejs)
- [How it Works](#how-it-works)
- [How I approched the Problem](#how-i-approached-the-problem)
- [Key Assumptions](#key-assumptions)
- [Extending/Productionizing](#extendingproductionizing)
- [Testing](#testing)

---

## Overview

- **Input:**
  - `emails.json` — sample email data
  - `pos.json` — sample PO data
- **Output:**
  - `output/output.csv` — a CSV table with `email_id`, matched `po_id`, `confidence`, and `reasoning`

Sample output (in `output.csv`):

| email_id | po_id | confidence | reasoning                           |
| -------- | ----- | ---------- | ----------------------------------- |
| 1        | PO-1  | 0.95       | Exact PO number found in subject    |
| 2        |       | 0.05       | Classified as spam/irrelevant       |
| 3        | PO-4  | 0.70       | Supplier name + delivery date match |

---

## How to Run (with Docker)

**_Recommended: No need to install Node.js, npm, or dependencies!_**

### 1. Build the Docker image:

```sh
docker build -t po-matcher .
```

### 2. Run the project"

Linux/macOS/WSL:

```sh
docker run --rm -v "$PWD/output:/app/output" po-matcher
```

Windows (PowerShell):

```sh
docker run --rm -v "%cd%/output:/app/output" po-matcher
```

The resulting output.csv will appear in your local output/ folder.

## How to Run Locally (Node.js)

If you want to run without Docker:

```sh
npm install
npm run build        # Compile TypeScript to /dist
npm start            # Runs node dist/main.js, output to output/output.csv
```

Or for development (with hot reload):

```sh
npm run dev          # Uses tsx to run TypeScript directly
```

## How it Works

- **Step 1:** Parses emails and POs from the provided JSON files.
- **Step 2:** For each email, tries to match to a PO using a hierarchy of logic:

   1. **PO number in subject/body:** Highest confidence.
   2. **Supplier name, delivery date, item description, quantities, or carrier in email body** (with heuristics and partial matches).
   3. **Contact email clues:** Matching sender/recipient with PO buyer/supplier.
   4. **If no match:** Flags as "spam/irrelevant" with low confidence.

- **Step 3:** Outputs results as a CSV table (email_id, po_id, confidence, reasoning).

The scoring, confidence, and matching logic is fully configurable and tested (see /src/helpers and /src/types).

## How I Approached the Problem

I approached this matching task as a classic “messy data integration” problem, focusing on modularity, clarity, and extensibility from the start.

1. **Project Setup:**
   I scaffolded a clean TypeScript project with strict type checking and code linting. All code lives in a structured /src directory, and data (emails, POs) in /data. I set up automated formatting, linting, and testing to ensure code quality.

2. **Type Definitions:**
   To make the logic clear and robust, I defined TypeScript types for emails and purchase orders, matching the provided JSON schemas. This helped surface mistakes early and made code much easier to maintain.

3. **Matching Logic:**

   - I broke the matching process into simple, testable helpers:
   - searchPOId: Looks for an exact PO number in the subject or body (highest confidence).
   - checkBodyAndEmails: Tries to match on supplier name, item description, carrier, delivery date, and even “fuzzy” partial item matches. This logic scores each possible match to surface the best guess for ambiguous cases.
   - Helper functions extract logic for matching contact emails and fuzzy item matching.
   - All scoring and confidence assignment are centralized and easily tunable.

4. **Confidence & Reasoning:**

   - Each match records not just the PO id, but also a confidence score and a human-readable reasoning string. This makes the output transparent for users and easy to debug or audit.

5. **Edge Cases & Extensibility:**

   - Emails that look like spam, marketing, or don’t match any PO get flagged with low confidence and a clear reason.
   - Human errors might prevent putting accurate confidence score
   - The design makes it easy to add new heuristics, NLP techniques, or additional data sources in the future.

6. **Output & Testing:**

   - The results are output as a CSV file for easy review in Excel or Google Sheets.
   - All matching logic is covered by unit tests (using Vitest) and the output folder is automatically created if missing.

7. **Containerization:**
   I provided a Dockerfile and simple run instructions, so the reviewer can execute everything without needing to install Node, TypeScript, or dependencies locally.

## Key Assumptions

- PO numbers are unique and (if found) provide a strong match.
- Partial matches (item names, dates, contact emails, etc.) are used when no exact PO number is present.
- The matching system is scored (see confidence), not just binary matched/unmatched.
- "Spam/irrelevant" means the email has no recognizable clues linking to any PO.
- The provided JSON input files follow the sample schema.

## Extending/Productionizing

**In a production environment, further enhancements might include:**

- Use a database instead of flat JSON files for larger datasets.
- Add NLP for more robust unstructured text parsing and fuzzy matching.
- Support for more fields or more advanced entity extraction (e.g., invoice numbers, shipping details).
- More scalable matching (e.g., indexed lookup for millions of POs).
- API or web interface for uploading new data and getting results.
- Logging, error handling, and validation.
- Cloud/CI integration for deployment and reproducibility.

## Testing

This project uses Vitest for unit testing:

```sh
npm run test
npm run test:coverage # For test coverage
```
