# EXP02 - Retry Amplification Under Dependency Degradation

## Experimental Objective

To investigate how timeout-driven retry behavior amplifies backend request pressure during degraded dependency response conditions.

The experiment focuses on the interaction between:
	- dependency latency
	- client timeout thresholds
	- retry behavior
	- backend request multiplication
	- delayed stabilization after degradation



# Hypothesis

When dependency response latency exceeds client timeout thresholds, retry behavior increases total backend execution volume by reissuing requests before upstream recovery completes.

We hypothesize that:

- dependency degradation will trigger timeout-driven retries
- retries will multiply backend work rather than reduce recovery time
- repeated retries will amplify backend pressure during unstable states
- retry amplification may persist even while original requests are still processing

In this framing, retries become a degradation amplifier rather than a recovery mechanism.



# Environment

## Backend Service

- Python Flask API
- Local execution environment
- Simulated dependency degradation behavior

## Load Generator

	- Apache JMeter 5.6.3
	- CLI execution mode

## System Under Test

Endpoint:
/api-with-dependency

The endpoint simulates a backend API affected by degraded upstream dependency response conditions.

---

# Validation Flow


	BASELINE
	→ LOAD
	→ DEGRADATION
	→ RETRY_PHASE
	→ RECOVERY
	→ RECOVERY_R2
	→ POSTBASELINE




# Degradation Scenario
-------------------------
## Dependency Delay
Injected dependency delay: 3000 ms


## Client Timeout
Configured client timeout: 1000 ms


This configuration intentionally creates timeout conditions before backend processing completes.

Initial controlled concurrent execution:
- 10 virtual users
- 60 second degradation window



# Behavioral Model

The experiment models a degraded upstream dependency where backend processing continues after the client timeout threshold has already expired.

This creates conditions where:
	- clients perceive failure
	- backend work continues executing
	- retries introduce additional concurrent pressure
	- degradation persists beyond the original latency event

The objective is not throughput benchmarking, but observation of instability amplification behavior under degraded coordination conditions.



# Retry Amplification Scenario

The retry phase simulates timeout-driven retry behavior using sequential retry requests.

Behavioral sequence:


	slow dependency
	→ client timeout
	→ retry execution
	→ duplicated backend work
	→ amplified request pressure
	→ delayed stabilization


The retry sequence intentionally generates multiple backend executions while the degraded dependency condition remains unresolved.



# Metrics Collected

## JMeter Metrics

	- response latency
	- request success/failure state
	- timeout behavior
	- retry amplification evidence

## Backend Metrics

	- request arrival timestamps
	- repeated execution evidence
	- degraded endpoint activity



# Expected Behavioral Outcome
-------------------------------
Expected observations include:
- repeated backend execution for unresolved operations
- increased failed request count
- elevated concurrent pressure during retry windows
- delayed stabilization during degraded conditions

The experiment is intended to demonstrate how retries can amplify backend degradation rather than accelerate recovery.

# Results
------------
Observed behavior:
- baseline request completed successfully
- degraded requests timed out at approximately 1000 ms
- backend logs confirmed repeated execution during retry scenarios
- retry attempts increased backend request volume under degraded conditions



# Interpretation
------------------
The experiment demonstrates that retry logic can unintentionally amplify degradation during unstable backend conditions.

Rather than helping recovery, retries may:
- increase backend coordination pressure
- prolong instability windows
- amplify queue buildup
- delay stabilization after degradation events

This aligns with broader recovery-sensitive behavior investigated in Collapse Lab.



# Conclusion
--------------
EXP02 validates that timeout-driven retry behavior can increase backend request load during degraded dependency conditions.

The results demonstrate how retry amplification can emerge even in small controlled environments when degraded dependencies remain unresolved while clients continue reissuing requests.