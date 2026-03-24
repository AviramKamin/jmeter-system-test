JMeter Load Test - Blocking Endpoint Analysis
----------------------------------------------
 Goal
----------
To analyze system behavior under load and understand the impact of a blocking endpoint on throughput and response time.



 System Under Test
-------------------
A simple Flask-based API with the following endpoints:

- /health - lightweight health check
- /products - simulated product retrieval
- /checkout - simulated checkout flow
- /slow - endpoint with artificial delay (delay_ms parameter)

Example implementation of slow endpoint:

@app.route("/slow")
def slow():
    delay = int(request.args.get("delay_ms", 200))
    time.sleep(delay / 1000.0)
    return jsonify({"status": "delayed", "delay_ms": delay})

---

	Test Setup
	-----------
- Tool: Apache JMeter
- Execution mode: Non-GUI (CLI)
- Load profile:
  - Threads: 20
  - Ramp-up: 10 seconds
  - Loop count: 5

	Scenarios
	----------
1. Mixed workload
   - /health
   - /products
   - /checkout
   - /slow?delay_ms=200

2. Isolated slow endpoint
   - /slow?delay_ms=200 only

---

	Initial Issue Discovered

During the first execution, the /slow endpoint returned:

- 25% error rate
- HTTP 500 responses

---

 Root Cause Analysis
---------------------
From Flask logs:

ValueError: invalid literal for int() with base 10: 'ms=200'

The request sent by JMeter was:

/slow?delay_ms=ms=200

Instead of:

/slow?delay_ms=200

This caused a failure when converting the parameter to an integer.

---

 Fix

Corrected JMeter parameter configuration:

| Name     | Value |
|----------|-------|
| delay_ms | 200   |

---

 Results
-----------
 Mixed Workload Scenario
-----------------------------
- Total requests: 400
- Errors: 0%
- Throughput: ~38 req/sec

Response times:
- Fast endpoints: ~3–5 ms
- Slow endpoint: ~210 ms

Observation:
- High throughput masked the impact of the slow endpoint

---

 Isolated Slow Endpoint Scenario
---------------------------------
- Total requests: 100
- Errors: 0%
- Average latency: ~217 ms
- p95 latency: ~221 ms
- Throughput: ~9.5 req/sec

---

 Key Insights
---------------
- Blocking operations (e.g., time.sleep) significantly reduce system throughput
- Mixed workloads can hide performance bottlenecks
- Incorrect request formatting can lead to misleading test results
- Valid performance analysis requires:
  - correct input
  - clean isolation of variables
- System behavior must be analyzed across layers:
  - load tool → HTTP request → backend → logs



 Conclusion

The system performs correctly under the tested load but is constrained by synchronous request handling.  
Throughput is directly limited by blocking operations, as demonstrated in the isolated slow endpoint scenario.



 What This Project Demonstrates
--------------------------------
- Load test design using JMeter
- CLI execution and report generation
- Debugging using backend logs
- Root cause analysis of failures
- Understanding of system-level performance behavior
