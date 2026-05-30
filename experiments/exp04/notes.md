EXP04 - Recovery Instability Under Backlog Pressure
------------------------------------------------------
## Hypothesis

When recovery processing occurs under significant backlog conditions, 
recovery latency will increase and stabilization will be delayed.

We hypothesize that:

	- backlog accumulation will create a persistent recovery workload
	- recovery processing latency will increase while queue depth remains elevated
	- recovery performance will improve only after backlog depth decreases
	- recovery behavior is influenced by internal system state rather than request arrival alone
	- stabilization may be delayed even after load generation has stopped


## Experimental Objective
----------------------------
To validate recovery-sensitive degradation behavior using a local Flask backend and Apache JMeter.
The experiment focuses on:

	- backlog-sensitive recovery
	- recovery latency amplification
	- delayed stabilization
	- queue depth influence on processing behavior
	- recovery performance under persistent workload pressure


## Method Overview
-------------------
The Flask backend queue model introduced in EXP03 was extended with recovery-sensitive processing behavior.
When queue depth exceeded a predefined threshold, additional processing delay was injected before queued work could be completed.

The backend exposed:

- POST /enqueue-work
- GET /queue-status
- POST /process-one?delay_ms=1000

JMeter executed:

	- backlog generation
	- sequential recovery processing
`

The experiment compares:
	- normal processing behavior
	- recovery behavior under elevated backlog conditions


## Test Conditions

### Backlog Generation

Threads: 5
Ramp-up: 1
Loop Count: 4

Total expected requests:
20 enqueue operations

Endpoint:
POST /enqueue-work
Expected behavior:

	- successful enqueue requests
	- queue depth growth
	- no backend failures


### Recovery Processor

Threads: 1
Ramp-up: 1
Loop Count: 15

Endpoint:
POST /process-one?delay_ms=1000

Recovery-sensitive behavior:
When:
queue_depth > 10
Additional randomized delay:

500-1500 ms
was injected into processing execution.
Expected behavior:

	- increased recovery latency under high backlog conditions
	- latency reduction as backlog decreases
	- successful request completion
	- delayed stabilization

## Metrics Collected

### JMeter
	- response latency
	- success/failure state
	- throughput
	- sample count
	- latency distribution


### Backend Queue State

	- queue depth
	- processed item count
	- recovery progress


## Results

### Backlog Generation

Samples: 20
Errors: 0
Average latency: 10 ms
Observed behavior:

	- enqueue requests completed successfully
	- queue depth increased rapidly
	- backend remained stable

### Recovery Processing

Samples: 15
Errors: 0
Average latency: 1965 ms
Minimum latency: 1524 ms
Maximum latency: 2503 ms
Throughput: 0.51 transactions/sec

Observed behavior:
	- recovery requests completed successfully
	- latency increased significantly under backlog pressure
	- recovery throughput decreased
	- stabilization remained dependent on queue depth


## Interpretation

The experiment demonstrates that recovery performance can degrade while backlog remains elevated.
Unlike EXP03, where processing latency remained relatively stable, EXP04 introduced backlog-sensitive recovery degradation.
Recovery behavior was influenced by internal queue state.
Observed latency increased substantially above the nominal processing delay while queue depth exceeded the recovery threshold.
This demonstrates that:

	- recovery is not always constant-time
	- backlog can directly influence recovery performance
	- stabilization may be delayed by residual workload
	- system recovery can become workload-sensitive


## Key Findings

### Recovery Latency Amplification Observed

Average processing latency increased to approximately:
1965 ms
compared to approximately:
1034 ms
observed in EXP03.

### Backlog Influences Recovery Behavior

Recovery performance changed as a function of queue depth.

### Delayed Stabilization Confirmed

System recovery remained dependent on outstanding queued work.

### Stable Execution Preserved

Despite increased latency:

	- 0% error rate
	- successful request completion
	- predictable recovery behavior


were maintained.
## Artifacts Generated

## JTL Files
exp04_recovery_instability_clean.jtl

## Screenshots
01_exp04_cli_run.png
02_exp04_dashboard.png
03_exp04_statistics_and_errors.png
04_exp04_clean_cli.png
05_exp04_dashboard.png
06_exp04_statistics.png

## HTML Dashboards
reports/exp04_recovery_instability_clean_report/

## Conclusion

EXP04 successfully validated recovery instability under backlog pressure using a local Flask backend and Apache JMeter.
The experiment demonstrated that recovery performance can degrade as a function of internal backlog state rather than active request arrival alone.
Observed latency increased substantially during backlog recovery while maintaining successful request completion.
This experiment extends the queue persistence model established in EXP03 and demonstrates 
that backlog conditions can directly influence recovery behavior and stabilization time.
