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

# EXP03 - Queue Buildup and Delayed Recovery

Focus:
	- queue accumulation
	- backlog persistence
	- delayed stabilization
	- slow processing recovery behavior
	- persistent backend state

Validated:
	- enqueue-driven queue growth
	- queue depth observability
	- slow sequential draining
	- backlog persistence after load
	- processing-rate-bounded recovery

Key observation:
The backend continued carrying unresolved queued work after active enqueue pressure stopped, 
demonstrating that load removal does not equal immediate recovery.

# Planned Experiments

## EXP04 - Recovery Instability

Planned focus:
	- unstable recovery states
	- intermittent post-load spikes
	- recovery-sensitive behavior
	- delayed normalization after degradation

# Behavioral Model

The lab investigates how backend systems transition between:

healthy state
	→ blocking latency
	→ degradation
	→ timeout escalation
	→ retry amplification
	→ queue buildup
	→ delayed recovery
	→ stabilization

The focus is not peak throughput benchmarking.
The focus is understanding:

	* instability amplification
	* degraded coordination behavior
	* backend recovery dynamics
	* observability during failure conditions

# Current Status

## Completed

* EXP01 - Blocking Latency Validation
* EXP02 - Retry Amplification Under Dependency Degradation
* EXP03 - Queue Buildup and Delayed Recovery

## In Progress

* Repository cleanup
* experiment standardization
* report organization
* screenshot cataloging

## Planned

* EXP04 - Recovery Instability
