# EXP03 - Queue Buildup and Delayed Recovery

## Hypothesis

When incoming work is accepted faster than it is processed, backend queue depth will increase and recovery will depend on drain capacity rather than request arrival alone.

We hypothesize that:
	- enqueue operations will complete successfully under moderate load
	- queue depth will accumulate during enqueue pressure
	- slow worker processing will reduce queue depth gradually
	- backlog may remain even after active load generation stops
	- recovery behavior depends on processing throughput

## Experimental Objective

To validate queue accumulation and delayed recovery behavior using a local Flask backend and Apache JMeter.

The experiment focuses on:
	- queue growth
	- slow draining behavior
	- persistent backend state
	- backlog visibility
	- delayed stabilization

## Method Overview

A Flask API backend was extended with an in-memory queue model.

Three endpoints were used:
	- POST /enqueue-work
	- GET /queue-status
	- POST /process-one?delay_ms=1000

JMeter executed:
	- enqueue load generation
	- slow sequential queue processing

The experiment compares:
	- queue growth under enqueue pressure
	- queue reduction under slow worker processing

## Test Conditions

### Initial Queue State

Before processor drain execution:

queue_depth: 13
processed_count: 1

This provided an existing backlog state before slow draining began.

### Enqueue Load

Threads: 5
Ramp-up: 1
Loop Count: 2

Total expected requests:
10 enqueue operations

Endpoint:
POST /enqueue-work

Expected behavior:
	- successful enqueue requests
	- queue depth increases
	- no backend failures

### Processor Drain

Threads: 1
Ramp-up: 1
Loop Count: 5

Endpoint:
POST /process-one?delay_ms=1000

Expected behavior:
	- one queued item processed per request
	- approximately 1000 ms processing latency
	- queue depth decreases gradually
	- processed count increases

## Metrics Collected

### JMeter

	- response latency
	- success/failure state
	- throughput
	- sample count
`

### Backend Queue State

	- queue depth
	- processed item count
	- queue persistence after load

## Results

### Enqueue Load

JMeter result:
Samples: 10
Errors: 0
Average latency: 18 ms


Observed behavior:
	- enqueue requests completed successfully
	- queue depth increased after execution
	- backend remained stable

### Processor Drain

JMeter result:

Samples: 5
Errors: 0
Average latency: 1034 ms
Minimum latency: 1010 ms
Maximum latency: 1118 ms
Throughput: 0.96 transactions/sec


Queue status after drain:
queue_depth: 8
processed_count: 6


Observed behavior:
	- processor requests completed successfully
	- queue depth decreased gradually
	- backlog remained after processing completed

## Interpretation

The experiment demonstrates that backend backlog recovery depends on processing throughput rather than request arrival alone.
The enqueue phase confirmed that work items can accumulate quickly while backend processing remains deferred.
The processor phase confirmed that slow draining reduces queue depth gradually rather than immediately eliminating backlog.

Importantly:
the queue still contained unresolved work after processor execution completed.

This demonstrates that:
	- load removal does not equal immediate recovery
	- residual backlog may persist after active traffic decreases
	- observability is required to determine actual stabilization state

The queue-status endpoint provided direct visibility into persistent backend state throughout the experiment.

## Key Findings

### Queue Growth Confirmed

Enqueue requests increased queue depth successfully under load.

### Processing Rate Controls Recovery

Recovery speed was bounded by worker processing throughput.
Observed throughput:

0.96 items/sec


### Persistent Backlog Observed
Queue depth remained non-zero after processor execution completed.

### Stable Sequential Processing
Processor drain completed without failures.

Observed behavior:
	- 0% error rate
	- stable sequential draining
	- predictable ~1000 ms processing latency

## Artifacts Generated

## JTL Files

exp03_enqueue_load.jtl
exp03_processor_drain.jtl

## Screenshots

01_enqueue_load_cli.png
02_queue_depth_after_enqueue.png
03_processor_drain_cli.png
04_queue_depth_after_drain.png
05_processor_drain_html_dashboard.png
06_processor_drain_statistics.png

## HTML Dashboards

reports/exp03_enqueue_load_report/
reports/exp03_processor_drain_report/

## Conclusion

EXP03 successfully validated queue buildup and delayed recovery behavior using a local Flask backend and Apache JMeter.

The experiment demonstrated that:
	- incoming work can accumulate faster than it is processed
	- queue depth persists across requests
	- recovery depends on worker drain capacity
	- backlog may remain after active load generation stops

This experiment establishes the foundational queue persistence model for future backlog 
and recovery-oriented instability experiments in the JMeter System Behavior Under Load Lab.
