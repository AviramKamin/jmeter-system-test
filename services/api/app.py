from flask import Flask, jsonify, request
import time
import random

# Create the Flask application instance.
# All API routes in this file are attached to this object.
app = Flask(__name__)


# Simple in-memory product catalog used by EXP01.
# This is intentionally small and local because the goal
# is backend behavior validation rather than real ecommerce logic.
PRODUCTS = [
    {"id": 1, "name": "Keyboard", "price": 120},
    {"id": 2, "name": "Mouse", "price": 75},
    {"id": 3, "name": "Monitor", "price": 900}
]


# EXP03:
# Global in-memory queue used for queue buildup simulations.
#
# We intentionally avoid Redis, RabbitMQ, or databases here.
# The objective is controlled local behavior experiments
# that remain simple and reproducible.
work_queue = []


# Tracks how many queue items were processed.
# This becomes useful later during recovery validation experiments.
processed_count = 0


# ------------------------------------------------------------
# BASIC HEALTH ENDPOINT
# ------------------------------------------------------------
# Used for:
# - baseline connectivity checks
# - simple JMeter validation
# - confirming backend availability
#
# EXP01 uses this as a fast stable endpoint.
@app.route("/health")
def health():
    return jsonify({
        "status": "ok"
    })


# ------------------------------------------------------------
# PRODUCT ENDPOINT
# ------------------------------------------------------------
# Simulates a lightweight backend API response.
# Used during early baseline load testing scenarios.
@app.route("/products")
def products():
    return jsonify({
        "status": "ok",
        "products": PRODUCTS
    })


# ------------------------------------------------------------
# CHECKOUT ENDPOINT
# ------------------------------------------------------------
# Simulates a backend write-style operation.
# A fake order ID is generated for each request.
# This endpoint is useful for:
# - POST request validation
# - request body handling
# - future concurrency experiments
@app.route("/checkout", methods=["POST"])
def checkout():

    # Read incoming JSON payload.
    # The current experiment does not validate the payload deeply,
    # because behavioral testing is the primary focus.
    data = request.json

    return jsonify({
        "status": "ok",
        "result": "accepted",
        "order_id": f"ORD-{random.randint(1000,9999)}"
    })


# ------------------------------------------------------------
# SLOW ENDPOINT
# ------------------------------------------------------------
# Simulates backend latency using controlled sleep delay.
# EXP01 uses this endpoint to validate:
# - latency measurement
# - concurrent request handling
# - blocking behavior under load
# Example:
# /slow?delay_ms=200
@app.route("/slow")
def slow():

    # Read delay value from query parameter.
    # Default delay is 200 ms.
    delay = int(request.args.get("delay_ms", 200))

    # Artificial backend blocking delay.
    time.sleep(delay / 1000.0)

    return jsonify({
        "status": "ok",
        "type": "slow_response",
        "delay_ms": delay
    })


# ------------------------------------------------------------
# DEPENDENCY ENDPOINT
# ------------------------------------------------------------
# Simulates an upstream dependency service.
# This endpoint can:
# - introduce artificial latency
# - simulate dependency failures
# Used for backend degradation experiments.
# Example:
# /dependency?delay_ms=3000
@app.route("/dependency")
def dependency():

    # Read optional delay value.
    delay_ms = int(request.args.get("delay_ms", 0))

    # Read optional failure flag.
    fail = request.args.get("fail", "false").lower() == "true"

    # Simulate slow dependency behavior.
    if delay_ms > 0:
        time.sleep(delay_ms / 1000.0)

    # Simulate dependency failure.
    if fail:
        return jsonify({
            "status": "error",
            "type": "dependency_failure",
            "message": "Simulated dependency failure"
        }), 503

    return jsonify({
        "status": "ok",
        "type": "dependency_response",
        "delay_ms": delay_ms
    })


# ------------------------------------------------------------
# API WITH DEPENDENCY
# ------------------------------------------------------------
# EXP02:
# Simulates a backend API affected by degraded upstream dependency behavior.
# This endpoint is intentionally designed to investigate:
# - timeout escalation
# - retry amplification
# - duplicated backend execution
# - instability during degraded dependency states
# Example:
# /api-with-dependency?dependency_delay_ms=3000
@app.route("/api-with-dependency")
def api_with_dependency():

    # Read artificial dependency delay.
    dependency_delay_ms = int(
        request.args.get("dependency_delay_ms", 0)
    )

    # Optional dependency failure simulation.
    fail_dependency = (
        request.args.get("fail_dependency", "false").lower() == "true"
    )

    # Simulate slow upstream dependency behavior.
    #
    # Important:
    # Backend processing continues even if the client
    # later times out and retries.
    if dependency_delay_ms > 0:
        time.sleep(dependency_delay_ms / 1000.0)

    # Simulate dependency failure condition.
    if fail_dependency:
        return jsonify({
            "status": "error",
            "http_status": 503,
            "type": "upstream_dependency_failure",
            "message": "API failed because simulated dependency failed",
            "dependency_delay_ms": dependency_delay_ms
        }), 503

    return jsonify({
        "status": "ok",
        "type": "api_with_dependency_response",
        "dependency_delay_ms": dependency_delay_ms
    })


# ------------------------------------------------------------
# ENQUEUE WORK ENDPOINT
# ------------------------------------------------------------
# EXP03:
# Adds work items into an in-memory queue.
# This endpoint allows controlled queue buildup experiments
# without requiring external infrastructure like Redis.
# Future experiments will investigate:
# - queue growth
# - delayed recovery
# - backlog draining behavior
# - post-load stabilization timing
@app.route("/enqueue-work", methods=["POST"])
def enqueue_work():

    # Create a simulated work item.
    item = {
        "id": f"WORK-{random.randint(1000, 9999)}",
        "created_at": time.time()
    }

    # Add work item into the queue.
    work_queue.append(item)

    return jsonify({
        "status": "ok",
        "type": "work_enqueued",
        "queue_depth": len(work_queue),
        "work_id": item["id"]
    })


# ------------------------------------------------------------
# QUEUE STATUS ENDPOINT
# ------------------------------------------------------------
# EXP03:
# Exposes current queue state for observability purposes.
# This endpoint is important because it allows:
# - queue depth observation
# - backlog tracking
# - delayed recovery validation
# - stabilization monitoring
@app.route("/queue-status")
def queue_status():

    return jsonify({
        "status": "ok",
        "type": "queue_status",
        "queue_depth": len(work_queue),
        "processed_count": processed_count
    })


# ------------------------------------------------------------
# PROCESS ONE WORK ITEM
# ------------------------------------------------------------
#
# EXP03:
# Simulates a slow worker processing queued items.
#
# This endpoint intentionally processes only ONE queue item
# at a time so backlog buildup becomes observable under load.
#
# Future experiments will use this behavior to investigate:
# - queue accumulation
# - delayed recovery
# - backlog draining speed
# - stabilization after load stops
@app.route("/process-one", methods=["POST"])
def process_one():

    global processed_count

    # Optional artificial processing delay.
 
    # Example:
    # /process-one?delay_ms=500
    delay_ms = int(request.args.get("delay_ms", 500))
    # EXP04:
    # Recovery-sensitive processing behavior.

    # When queue depth remains high, processing becomes less stable.
    # This simulates a backend that drains backlog more slowly during recovery.
    if len(work_queue) > 10:
        delay_ms += random.randint(500, 1500)

    # If queue is empty, nothing can be processed.
    if len(work_queue) == 0:
        return jsonify({
            "status": "empty",
            "message": "No work items available",
            "queue_depth": 0,
            "processed_count": processed_count
        })

    # Simulate slow worker processing.
    time.sleep(delay_ms / 1000.0)

    # Remove oldest item from queue.
    item = work_queue.pop(0)

    # Track processed item count.
    processed_count += 1

    return jsonify({
        "status": "ok",
        "type": "work_processed",
        "processed_work_id": item["id"],
        "processing_delay_ms": delay_ms,
        "queue_depth": len(work_queue),
        "processed_count": processed_count
    })

# ------------------------------------------------------------
# APPLICATION ENTRY POINT
# ------------------------------------------------------------
# Starts the Flask development server locally.
# Debug mode is intentionally enabled because:
# - this is a local investigation lab
# - rapid experiment iteration is useful
# - production deployment is NOT the objective
if __name__ == "__main__":
    app.run(debug=True)