# JMeter Load Test - System Behavior Analysis

## Overview

This project demonstrates system behavior under load using Apache JMeter and a simple Flask-based API.

The focus is not on performance tuning, but on:
- identifying failures
- analyzing system behavior
- understanding the impact of blocking operations

## Purpose

This project is a proof-of-concept (POC) designed to demonstrate how system behavior changes under load, especially when a blocking endpoint is introduced.
It focuses on identifying bottlenecks, debugging failures, and understanding how throughput is affected by synchronous operations.

## Project Structure


jmeter-project/
│
├── app/ # Flask API (system under test)
│ └── app.py
│
├── test-plan/ # JMeter test plan
│ └── main_load_test.jmx
│
├── results/ # Raw results and reports
│ ├── mixed_workload_fixed.jtl
│ ├── slow_only.jtl
│ └── slow_only_report/
│
├── docs/ # Analysis and notes
│ └── jmeter_notes.md
│
├── requirements.txt
└── README.md

---

## System Under Test

A simple Flask API with the following endpoints:

- `/health` - health check  
- `/products` - simulated product retrieval  
- `/checkout` - simulated checkout  
- `/slow` - endpoint with artificial delay  

Example:
/slow?delay_ms=200


## How to Run

### 1. Install dependencies

pip install -r requirements.txt

### 2. Run the Flask server

py app/app.py

Server will run at:
http://127.0.0.1:5000

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
 - Basic response validation was added using a JMeter Response Assertion on HTTP status code 200.

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
