# Experiment 01 - Blocking Latency Validation

## Objective

Evaluate how synchronous blocking behavior affects backend throughput and request latency under concurrent load.

---

# Hypothesis

Blocking request handlers reduce throughput and increase latency as concurrent request volume grows.

Mixed endpoint traffic may also hide isolated bottlenecks unless blocking endpoints are tested independently.

---

# Environment

## Backend

- Python backend service
- Local execution environment
- Blocking endpoint using artificial delay

## Load Generator

- Apache JMeter 5.6.3

## Test Machine

- Windows 10
- Localhost environment

---

# Validation Flow

```text
BASELINE
→ LOAD
→ DEGRADATION
→ RECOVERY
```

---

# Endpoint Under Test

```text
/slow?delay_ms=200
```

The endpoint intentionally blocks request processing for a fixed duration.

---

# Load Pattern

## Concurrent Users

Example:

- 10 users
- loop-based execution
- fixed duration test

## Goal

Force concurrent blocking requests to observe:

- throughput degradation
- response time accumulation
- request saturation

---

# Metrics Collected

- average latency
- throughput
- error count
- HTTP response validation
- backend response behavior

---

# Results Summary

## Observed Behavior

- throughput decreased significantly under blocking conditions
- latency increased consistently during sustained load
- isolated endpoint testing exposed bottlenecks more clearly than mixed traffic testing

## Example Metrics

| Metric | Approximate Value |
|---|---|
| Average Latency | ~217 ms |
| Throughput | ~9.5 req/sec |

---

# Key Findings

## 1. Blocking Reduces Throughput

Synchronous request handling limits request concurrency and reduces overall service throughput.

---

## 2. Mixed Traffic Can Hide Bottlenecks

When fast and slow endpoints are tested together, aggregate metrics may underrepresent the impact of blocking operations.

---

## 3. Validation Accuracy Depends on Correct Request Configuration

Incorrect request formatting or weak assertions can generate misleading performance conclusions.

---

# Conclusions

Even simple blocking behavior can significantly affect backend responsiveness under concurrent load.

Backend validation requires observing:

- request behavior
- latency growth
- throughput degradation
- recovery behavior
- response correctness

instead of relying only on aggregate load statistics.