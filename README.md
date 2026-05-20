# Backend System Validation Lab

A focused backend/system validation lab for testing how service behavior changes under load, blocking operations, latency degradation, retries, timeouts, and recovery phases.

This project evolved from a small JMeter PoC into a structured validation environment aimed at practical System QA / Backend QA work.

## Mission

Validate backend behavior under controlled load and failure conditions using reproducible experiments, JMeter load generation, backend logs, and measurable results.

The goal is not to build a production platform.
The goal is to demonstrate practical backend/system validation skills.

## What This Project Demonstrates

- Backend load validation
- Blocking endpoint behavior
- Latency degradation analysis
- JMeter CLI execution
- HTTP response validation
- Backend log investigation
- Reproducible test runs
- System-level thinking beyond simple tool usage

## Current Scope

Current version focuses on a Flask-based backend service tested with Apache JMeter.

Main validation scenario:

- Baseline API behavior
- Mixed workload behavior
- Isolated blocking endpoint behavior
- Throughput and latency comparison
- Error/request validation

## Non-Goals

This project is intentionally NOT:

- a Kubernetes project
- a cloud infrastructure project
- a full SRE platform
- a distributed systems architecture project
- a theoretical performance research project
- a DevOps showcase
- an endless exploratory lab

Scope is intentionally limited to backend/system validation for QA employability.

## System Under Test

Current service endpoints:

- `/health` - health check
- `/products` - simulated product retrieval
- `/checkout` - simulated checkout
- `/slow?delay_ms=200` - artificial blocking endpoint

## Project Structure

```text
backend-system-validation-lab/

├── services/
│   └── api/                  # Backend API service
│
├── jmeter/
│   ├── testplans/            # JMeter .jmx files
│   └── results/              # Raw .jtl files and HTML reports
│
├── experiments/
│   └── exp01_blocking_latency/
│
├── docs/
│   ├── methodology/
│   ├── scenarios/
│   └── jmeter_notes.md
│
├── architecture/
├── requirements.txt
├── LICENSE
└── README.md