# JMeter Load Test - System Behavior Analysis

## Overview

This project demonstrates system behavior under load using Apache JMeter and a simple Flask-based API.

The focus is not on performance tuning, but on:
- identifying failures
- analyzing system behavior
- understanding the impact of blocking operations

---

## Project Structure
jmeter-project/
├── app/ # Flask API (system under test)
│ └── app.py
├── test-plan/ # JMeter test plan
│ └── main_load_test.jmx
├── results/ # Raw results and HTML report
│ ├── mixed_workload_fixed.jtl
│ ├── slow_only.jtl
│ └── slow_only_report/
├── docs/ # Analysis and notes
│ └── jmeter_notes.md
├── requirements.txt


---

## System Under Test

A simple Flask API with the following endpoints:

- `/health` - health check  
- `/products` - simulated product retrieval  
- `/checkout` - simulated checkout  
- `/slow` - endpoint with artificial delay  

Example:
/slow?delay_ms=200


---

### 3. Run JMeter test (CLI)


cd C:\jmeter\bin

jmeter -n -t "C:\path\to\jmeter-project\test-plan\main_load_test.jmx" -l "C:\path\to\jmeter-project\results\run.jtl"


---

### 4. Generate report


jmeter -g "C:\path\to\results\run.jtl" -o "C:\path\to\results\report"


---

## Key Findings

- Blocking endpoints significantly reduce throughput
- Mixed workloads can hide performance bottlenecks
- Incorrect request formatting can lead to misleading results
- System behavior must be analyzed across layers:
  - load tool → HTTP → backend → logs

---

## Example Insight

When isolating the slow endpoint:

- Average latency: ~217 ms  
- Throughput: ~9.5 requests/sec  

This demonstrates how synchronous blocking limits system capacity.

---

## What This Project Shows

- JMeter test design and execution (GUI + CLI)
- Debugging using backend logs (Flask)
- Root cause analysis of failures
- System-level thinking (not just tool usage)