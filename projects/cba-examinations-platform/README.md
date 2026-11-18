# CBA Examinations Platform
### Independent professional learning and assessment platform — case study

> **Independent project.** Not an official product of, affiliated with, or endorsed by a regulator. This repository contains a generalized public case study only.

**Domain:** financial education, professional exam preparation, multilingual content operations and assessment design  
**Status:** architecture/content baselines documented; content QA and application delivery have independent gates. No public claim of completed production release.

## The challenge

Turn a large, evolving collection of professional study materials into a structured, reliable learning and examination experience. Content must remain traceable to authoritative sources while the user experience supports several languages, guided learning, practice questions and more formal assessment.

## What was designed

| Capability | Approach |
|---|---|
| Structured study | Modular curriculum with separate study topics and exam-question layer |
| Localization | Russian, Azerbaijani and English with semantic/parity checks |
| Question management | Stable identifiers and separation of lesson exercises from the standalone assessment bank |
| Assessment | Timed examination concepts and untimed practice as distinct flows |
| Identity | Account verification, controlled sessions and administrative recovery concepts |
| Analytics | Progress, attempts and aggregate results designed with privacy controls |
| Governance | Source provenance, QA evidence, change gates and controlled staging |
| UI | Compact navigation, topic-oriented study views and a separate financial-learning area |

## Scale — approved design/content baselines, not live-user counts

- **54 study topics** across **11 curriculum modules** are tracked in the content workflow.
- A **separate assessment baseline** contains **52 assessment topics**, **1,560 questions per language**, and **three target languages** (4,680 localized question records as a baseline).
- These counts refer to **different content layers**. The 54-topic curriculum must not be confused with the 52-topic canonical question structure.
- User registration and traffic counts are intentionally **not claimed** here: no verified public-safe utilization snapshot is included.

## Product journey

1. Curate source material and map it to the curriculum.
2. Author and validate the source-language study material.
3. Localize to AZ/EN with independent semantic checks.
4. Import approved content into controlled application layers.
5. Let the learner navigate topics, practice, and take an assessment.
6. Persist permitted progress/attempt data; monitor quality and reconcile results.

[Architecture and data flows](architecture.md) · [QA & delivery approach](quality-and-delivery.md)

## What made this challenging

- **Accuracy over volume:** source claims, numerical examples and translated obligations cannot silently drift.
- **Two separate question layers:** lesson-level practice cannot overwrite the canonical exam bank.
- **Reproducibility:** source registers, stable IDs, release gates and evidence-based QA make content changes inspectable.
- **Security by design:** assessment answers should not be exposed to the browser during an active attempt.
- **Incremental modernization:** useful legacy components are assessed for KEEP / MIGRATE / ENRICH / CORRECT / DROP, rather than copied blindly.

## Boundaries

Architecture diagrams represent the design model. A documented baseline or a QA-passed content batch does **not** imply completed authentication, deployment, regulatory approval or production usage. No private study materials, exam questions or answers are published.

---

**RU · Краткое описание:** независимая образовательная и экзаменационная платформа для профессиональной подготовки. Публично представлены структура учебных материалов, трёхъязычный workflow, система контроля качества, архитектура и подход к тестированию. Реальная база вопросов, персональные данные и внутренние документы не раскрываются.
