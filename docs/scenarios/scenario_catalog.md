# Validation Scenario Catalog

This document defines the fixed validation scope for the project.

The purpose of the catalog is to prevent uncontrolled scope expansion and maintain reproducible validation scenarios.

---

# Scenario 01 - Blocking Latency

Status: Active

## Goal

Measure throughput and latency impact caused by synchronous blocking operations.

## Focus Areas

- response latency
- throughput degradation
- request saturation
- blocking behavior

## Components

- FastAPI service
- JMeter load generation

---

# Scenario 02 - Retry Amplification

Status: Planned

## Goal

Observe how aggressive retries amplify backend load during degraded response conditions.

## Focus Areas

- retry storms
- timeout behavior
- request multiplication
- delayed recovery

---

# Scenario 03 - Queue Buildup

Status: Planned

## Goal

Observe backlog accumulation when producer throughput exceeds worker processing capacity.

## Focus Areas

- queue depth growth
- processing lag
- delayed stabilization

---

# Scenario 04 - Timeout Cascade

Status: Planned

## Goal

Evaluate how dependency slowdowns propagate through request chains.

## Focus Areas

- timeout propagation
- blocked requests
- latency amplification

---

# Scenario 05 - Partial Failure

Status: Planned

## Goal

Observe service behavior under intermittent dependency failures.

## Focus Areas

- error handling
- degraded operation
- partial recovery

---

# Scenario 06 - Recovery Dynamics

Status: Planned

## Goal

Analyze stabilization behavior after degradation and retry phases end.

## Focus Areas

- recovery time
- lingering backlog
- oscillation behavior
- post-degradation normalization

---

# Scope Boundaries

This project intentionally excludes:

- Kubernetes
- cloud orchestration
- distributed clusters
- service mesh infrastructure
- large-scale SRE workflows
- theoretical distributed systems research

The project is intentionally focused on practical backend/system validation scenarios for QA-oriented engineering work.