from flask import Flask, jsonify, request
import time
import random

app = Flask(__name__)

PRODUCTS = [
    {"id": 1, "name": "Keyboard", "price": 120},
    {"id": 2, "name": "Mouse", "price": 75},
    {"id": 3, "name": "Monitor", "price": 900}
]

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

@app.route("/products")
def products():
    return jsonify({"products": PRODUCTS})

@app.route("/checkout", methods=["POST"])
def checkout():
    data = request.json
    return jsonify({
        "result": "accepted",
        "order_id": f"ORD-{random.randint(1000,9999)}"
    })

@app.route("/slow")
def slow():
    delay = int(request.args.get("delay_ms", 200))
    time.sleep(delay / 1000.0)
    return jsonify({"status": "delayed", "delay_ms": delay})

if __name__ == "__main__":
    app.run(debug=True)