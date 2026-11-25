---
name: delta-only-qa
description: Plan the smallest evidence-backed QA delta and preserve unchanged verified scope.
---

# delta-only-qa

Version: 1.0.0 (2026-11-25).

Compare stable IDs, semantic/scoped content fingerprints and relevant dependency fingerprints, not only whole-file hashes. Classify added, changed, removed, unchanged and affected dependencies. Reuse unchanged verified gates with evidence; test changed and affected gates plus required integration/regression contracts. Preserve unrelated material and previous evidence. If impact cannot be bounded, mark BLOCKED or justify a broader gate with actual dependency evidence; never assume unchanged. For a batch, reconcile counts and record exact changed IDs. A repaired item receives a new verdict, not a silent overwrite.

## Required output
Record scope, gate, identity, verdict, evidence and next step. Use the shared ledger contract; preserve approval boundaries and project-specific requirements. Never claim runtime verification not performed.
