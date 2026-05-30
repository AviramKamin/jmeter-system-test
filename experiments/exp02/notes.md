# EXP02 - Retry Amplification Under Dependency Degradation

 Hypothesis
-------------
Under degraded dependency conditions, retry behavior amplifies backend request volume by reissuing operations before upstream recovery completes.

We hypothesize that:
	- dependency latency exceeding client timeout thresholds will trigger retry behavior
	- retries will multiply backend execution volume
	- backend load amplification can occur even when the original operation is still processing
	- repeated retries can increase instability rather than accelerate recovery

 Experimental Objective
-------------------------
To validate that timeout-driven retries increase backend request pressure during degraded dependency response conditions.

 Method Overview
------------------
A Flask API endpoint was configured with artificial dependency delay injection.

JMeter executed:
	- baseline request flow
	- timeout validation
	- sequential retry amplification scenarios

The experiment compares:
	- successful baseline execution
	- timeout-induced failure
	- repeated retry execution against a degraded dependency path

 Test Conditions
--------------------
### Baseline
dependency_delay_ms=0

Expected behavior:
request completes successfully without retry escalation.

### Timeout Validation
dependency_delay_ms=3000

Client timeout:
1000 ms

Expected behavior:
request timeout before backend completion.

### Retry Amplification
Two sequential retry samplers executed against the degraded dependency path.

Purpose:
observe whether retries increase backend request execution volume.

## Metrics Collected

### JMeter
	- response latency
	- success/failure state
	- timeout behavior
	- sample count

### Backend Logs
	- request arrival timestamps
	- repeated execution evidence
	- degraded endpoint activity

Results
-------------
### Baseline
Single request completed successfully.

Observed latency remained within normal response envelope.

### Timeout Validation
Request exceeded configured client timeout threshold.

JMeter recorded request failure while backend execution continued.

### Retry Amplification
Sequential retries produced multiple backend executions for the same degraded logical operation.

Backend logs confirmed repeated request arrival during unresolved dependency delay conditions.

Observed behavior:
- request duplication
- increased backend execution pressure
- repeated degraded dependency access

 Interpretation
----------------
The experiment demonstrates that retries can amplify backend request pressure during partial degradation events.

Importantly:
retry logic did not reduce recovery time.
Instead, retries increased concurrent backend work while the dependency remained unresolved.

This creates conditions that can contribute to:
- queue buildup
- latency amplification
- cascading instability
- degraded recovery behavior

 Conclusion
----------------
EXP02 validates that timeout-driven retry behavior can increase backend request load during degraded dependency conditions.

This aligns with broader system instability patterns investigated in Collapse Lab, where recovery-sensitive states exhibit disproportionate amplification under repeated coordination pressure.