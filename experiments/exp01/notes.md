 EXP01 - Blocking Latency Validation
-------------------------------------
## Overview

This experiment validates baseline backend behavior under controlled blocking latency conditions using Apache JMeter and a local Flask service.

The goal was not to generate collapse behavior yet.

The objective was to establish a clean reference point for later experiments involving:
	- retries
	- timeout amplification
	- degradation under sustained load
	- queue buildup
	- recovery instability

This experiment acts as the control condition for the rest of the JMeter System Behavior Under Load Lab.


# Hypothesis

A backend endpoint that introduces fixed blocking delay should:
	- exhibit predictable latency
	- remain stable under moderate concurrent load
	- avoid error amplification when retries are absent

If the system remains stable under controlled blocking conditions, later instability experiments can be compared against this baseline.


# Environment

## Hardware / OS

	- Windows 11
	- Localhost execution
	- Flask development server
	- Apache JMeter 5.6.3
	- Java Temurin OpenJDK 25



# Backend Service

The Flask backend exposed two endpoints used during validation.

## Health Endpoint
/health


Purpose:
	- baseline service availability validation

Expected behavior:
	- HTTP 200
	- minimal latency

## Slow Endpoint
/slow?delay_ms=200


Purpose:
	- simulate synchronous blocking latency

Expected behavior:
	- HTTP 200
	- stable ~200ms latency
	- no failures under moderate concurrency

# Experiment Structure

The experiment was executed in three phases.

# Phase 1 - Baseline Validation

## Objective

Verify:
	- JMeter CLI execution
	- assertion correctness
	- backend availability
	- result logging
	- JTL generation

## Configuration

### Thread Group

Threads: 1
Ramp-up: 1
Loop Count: 1


### Endpoint

/health


### Assertion
Response Code Equals 200



## Result
Samples: 1
Errors: 0
Average latency: 54 ms


## Interpretation

The service responded successfully with minimal latency.

This validated:
	- CLI execution pipeline
	- assertions
	- backend availability
	- JTL generation
	- report generation compatibility
# Phase 2 - Single Blocking Request

## Objective

Validate blocking latency behavior without concurrency.

## Configuration

### Thread Group
Threads: 1
Ramp-up: 1
Loop Count: 1

### Endpoint
/slow?delay_ms=200

### Assertion
Response Code Equals 200

## Result
Samples: 1
Errors: 0
Average latency: 279 ms

## Interpretation

Observed latency exceeded the artificial delay slightly due to:
	- Flask processing overhead
	- localhost networking overhead
	- JMeter timing overhead

The endpoint remained stable and deterministic.
# Phase 3 - Concurrent Blocking Load

## Objective

Observe backend behavior under moderate concurrent blocking load.

## Configuration

### Thread Group
Threads: 20
Ramp-up: 1
Loop Count: 5


### Total Requests
100 requests

### Endpoint
/slow?delay_ms=200


### Assertion
Response Code Equals 200


# Results

## CLI Summary
Samples: 100
Errors: 0
Average latency: 218 ms
Minimum latency: 204 ms
Maximum latency: 256 ms
Throughput: 48.4 requests/sec

## HTML Dashboard Statistics
Average: 218.71 ms
Median: 218 ms
90th percentile: 220.90 ms
95th percentile: 227.75 ms
99th percentile: 256 ms
Throughput: 52 transactions/sec
(SEE SCREENSHOOTS LIBERERY)

# Backend Observations

Flask logs showed:
	- dense concurrent request arrival
	- successful HTTP 200 responses
	- no backend crashes
	- no timeout amplification
	- no retry storms
	- no visible instability



# Key Findings

## Stable Concurrent Latency

Despite concurrent blocking requests, latency remained relatively stable.

Observed spread:
204 ms → 256 ms

This indicates:
	- predictable blocking behavior
	- absence of queue explosion
	- absence of uncontrolled degradation

## No Failure Amplification

The system produced:

0% error rate

under moderate concurrency.

This establishes a useful reference point for future retry amplification experiments.


## Baseline Control Condition Established

EXP01 now acts as the control condition for future experiments involving:
- retry amplification
- timeout chains
- degradation behavior
- recovery instability
- queue buildup
- backend saturation

# Artifacts Generated

## JTL Files

exp01_baseline_success.jtl
exp01_slow_endpoint_single.jtl
exp01_concurrent_load.jtl

---

## Screenshots
01_baseline_success_cli.png
02_slow_endpoint_single_cli.png
03_concurrent_load_cli.png
04_html_dashboard.png
05_backend_concurrent_requests.png

## HTML Dashboard

reports/exp01_blocking_latency_report/

# Conclusion

EXP01 successfully validated blocking latency behavior under controlled concurrent load conditions.
The backend remained stable and predictable during all phases of testing.
No collapse behavior emerged under this load level.
This experiment establishes the foundational reference state for future instability-oriented experiments in the JMeter System Behavior Under Load Lab.