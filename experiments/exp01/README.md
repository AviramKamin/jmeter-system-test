# Backend System Validation Lab

A controlled backend/system behavior investigation lab focused on degradation, retry amplification, 
blocking latency, recovery behavior, and observability-oriented validation using Apache JMeter and Python Flask services.

The project investigates how backend systems behave under:
	- blocking request patterns
	- degraded dependency conditions
	- timeout escalation
	- retry amplification
	- concurrent pressure
	- recovery transitions

This is not intended to be enterprise-scale performance engineering.

The lab focuses on:
	- behavioral validation
	- degradation analysis
	- instability investigation
	- reproducible backend experiments
	- observability-driven reasoning

# Project Goals

The objective of the lab is to simulate controlled backend degradation scenarios and observe how systems respond under stress conditions.

Key investigation themes include:
	- latency accumulation
	- retry amplification
	- backend pressure multiplication
	- queue buildup
	- delayed stabilization
	- recovery instability

The experiments are designed to remain:
	- reproducible
	- finite in scope
	- easy to execute locally
	- investigation-oriented rather than benchmark-oriented

# Technology Stack

## Backend

- Python
- Flask

## Load Generation

- Apache JMeter 5.6.3
- CLI execution mode

## Environment

- Windows 11
- Localhost execution
- Java Temurin OpenJDK 25

# Repository Structure

```text
backend-system-validation-lab/

├── experiments/
│   ├── exp01_blocking_latency/
│   ├── exp02_retry_amplification/
│   ├── exp03_queue_buildup/
│   └── exp04_recovery_instability/
│
├── jmeter/
│   ├── testplans/
│   ├── results/
│   └── reports/
│
├── services/
│   └── api/
│
├── scripts/
└── README.md
```

# Experiments

# EXP01 - Blocking Latency Validation

Focus:
	- blocking backend behavior
	- concurrent request handling
	- latency accumulation under load
	- baseline system stability

Validated:
	- JMeter assertions
	- concurrent blocking requests
	- latency measurements
	- HTML report generation
	- backend request visibility

Key observation:
The backend remained stable under moderate concurrent blocking load and established a clean behavioral baseline for later degradation experiments.

# EXP02 - Retry Amplification Under Dependency Degradation

Focus:
	- timeout behavior
	- retry amplification
	- backend request duplication
	- degraded dependency simulation

Validated:
	- client timeout escalation
	- repeated backend execution
	- retry-driven pressure amplification
	- backend processing continuation after client timeout

Key observation:
Retries amplified backend request pressure while degraded dependency conditions remained unresolved.

# Planned Experiments

## EXP03 - Queue Buildup and Delayed Recovery

Planned focus:
	- backlog accumulation
	- delayed stabilization
	- post-load latency persistence
	- degraded processing recovery behavior

## EXP04 - Recovery Instability

Planned focus:
	- unstable recovery states
	- intermittent post-load spikes
	- recovery-sensitive behavior
	- delayed normalization after degradation

# Behavioral Model

The lab investigates how backend systems transition between:

healthy state
→ degradation
→ timeout escalation
→ retry amplification
→ recovery
→ stabilization


The focus is not peak throughput benchmarking.

The focus is understanding:
- instability amplification
- degraded coordination behavior
- backend recovery dynamics
- observability during failure conditions

# Running the Backend Service

From the project root:

py services\api\app.py

Default service address:

http://localhost:5000


# Running JMeter Tests

Example CLI execution:

```bat
jmeter -n -t "jmeter\testplans\blocking_latency_validation.jmx" -l "jmeter\results\exp01_concurrent_load.jtl"
```

# Generating HTML Reports

Example:

```bat
jmeter -g "jmeter\results\exp01_concurrent_load.jtl" -o "jmeter\reports\exp01_blocking_latency_report"
```

Generated reports include:
- latency statistics
- throughput metrics
- percentile distributions
- error visibility
- APDEX scoring

# Artifacts

Experiments generate:
- `.jmx` test plans
- `.jtl` result files
- HTML dashboards
- backend log evidence
- screenshots
- structured experiment notes

# Validation Philosophy

This project treats backend validation as a behavioral investigation process rather than simple traffic generation.

The emphasis is on:
- reproducibility
- controlled degradation
- measurable system transitions
- evidence preservation
- interpretation of instability behavior

# Current Status

## Completed

- EXP01 - Blocking Latency Validation
- EXP02 - Retry Amplification Under Dependency Degradation

## In Progress

- Repository cleanup
- experiment standardization
- report organization
- screenshot cataloging

## Planned

- EXP03 - Queue Buildup
- EXP04 - Recovery Instability

# Long-Term Objective

The lab is intended to support:
- System QA positioning
- backend validation workflows
- observability-oriented troubleshooting
- degradation-focused testing
- investigation-driven QA methodologies

rather than generic UI automation or synthetic benchmark demonstrations.