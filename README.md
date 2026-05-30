# Backend System Validation Lab
A focused backend/system validation lab for testing how service behavior changes under load,
 blocking operations, latency degradation, retries, timeouts, and recovery phases.
This project evolved from a small JMeter PoC into a structured validation environment aimed at practical System QA / Backend QA work.

## Mission

Validate backend behavior under controlled load and failure conditions using reproducible experiments, JMeter load generation, backend logs, and measurable results.

The goal is not to build a production platform.
The goal is to demonstrate practical backend/system validation skills.

## What This Project Demonstrates

	- Backend load validation
	- Retry amplification analysis
	- Queue buildup investigation
	- Recovery instability analysis
	- Latency degradation behavior
	- Backend observability reasoning
	- JMeter CLI execution
	- Backend log investigation
	- Reproducible experiment design
	- System-level validation methodology

## Current Scope

Current experiments investigate:

	- Blocking latency behavior
	- Timeout-driven retry amplification
	- Queue buildup and delayed recovery
	- Recovery instability under backlog pressure

The project focuses on how backend systems transition between healthy, degraded, recovery, and stabilization states.

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
	- `/queue-status
	- `/enqueue-work
	- `/process-one
	- `/api-with-dependency

## Project Structure

```text
backend-system-validation-lab/

├── experiments/
│   ├── exp01_blocking_latency/
│   │   ├── README.md
│   │   └── notes.md
│   │
│   ├── exp02_retry_amplification/
│   │   ├── README.md
│   │   └── notes.md
│   │
│   ├── exp03_queue_buildup/
│   │   ├── README.md
│   │   └── notes.md
│   │
│   └── exp04_recovery_instability/
│       ├── README.md
│       └── notes.md
│
├── jmeter/
│   ├── testplans/            # JMeter .jmx files
│   ├── results/              # Raw .jtl files
│   └── reports/              # Generated HTML dashboards
│
├── services/
│   └── api/                  # Flask backend service
│
├── screenshots/              # Experiment evidence
│
├── scripts/                  # Helper execution scripts
│
├── requirements.txt
├── LICENSE
└── README.md
```


## Behavioral Progression

Healthy State
    ↓
Blocking Latency
    ↓
Dependency Degradation
    ↓
Retry Amplification
    ↓
Queue Buildup
    ↓
Delayed Recovery
    ↓
Recovery Instability
    ↓
Stabilization