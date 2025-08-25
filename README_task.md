# Procurli take home task

## Intro

Hello!

This exercise simulates a real task from a day to day at procurli. As a
reminder, at procurli, we focus on taping into unstructured, messy
communications data, as well as ERP systems, to provide valuable automations for
procurement managers.

# Goal

The goal of this task is simple - create a system that matches each email with a
corresponding purchase order (PO). You are provided two files:

- `emails.json` - contains the email data
- `pos.json` - contains PO data from ERP

An expected output of your system is a table, with an email and a corresponding
PO id. The PO id column can be left blank, if there is no match. Bonus points if you
provide confidence scores or reasoning for each match. An example of such a
table is presented bellow.

| email_id | po_id  | confidence (optional) | reasoning (optional)                   |
|----------|--------|-----------------------|----------------------------------------|
| 1        | po1    | 0.95                  | Exact PO number found in subject line  |
| 2        |        | 0.05                  | Classified as spam/irrelevant          |
| 3        | po4    | 0.70                  | Supplier name + delivery date match    |

# Deliverables

- Your **code implementation** (**Python** preferred/JS/TS or other language of choice)  
- An **output file** (CSV or JSON) containing the email→PO matches  
- A short **write-up** (`README_solution.md`) describing:  
  - How you approached the problem  
  - Key assumptions you made  
  - How you would extend or productionize this system  


## What We’re Looking For

- Clear, maintainable code and sensible structure  
- Thoughtful reasoning behind your approach  
- Handling of edge cases (e.g., spam emails, partial matches)  
- (Optional) Enhancements such as confidence scoring, unit tests, or modular design for extensibility  

---

## Time

We suggest spending **~4–8 hours** on this task.  
Don’t over-engineer — focus on a working, well-structured solution.  

---

Good luck 
We’re excited to see how you approach messy real-world data problems!
