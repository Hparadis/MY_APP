from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import json, os, uuid
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", os.getenv("FRONTEND_URL", "*")])

# ── Simple file-based store (swap for Supabase/Postgres later) ──
DATA_FILE = os.path.join(os.path.dirname(__file__), "data.json")

def read_data():
    if not os.path.exists(DATA_FILE):
        return {"contacts": [], "ideas": []}
    with open(DATA_FILE) as f:
        return json.load(f)

def write_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

# ── Health check ──
@app.route("/")
def index():
    return jsonify({"status": "ok", "app": "Hirwa Personal API"})

# ── Contacts ──
@app.route("/api/contacts", methods=["GET"])
def get_contacts():
    data = read_data()
    return jsonify(data["contacts"])

@app.route("/api/contacts", methods=["POST"])
def add_contact():
    body = request.get_json()
    if not body or not body.get("name") or not body.get("contact"):
        return jsonify({"error": "name and contact are required"}), 400

    entry = {
        "id":        str(uuid.uuid4()),
        "name":      body["name"].strip(),
        "contact":   body["contact"].strip(),
        "socials":   body.get("socials", {}),
        "note":      body.get("note", ""),
        "savedAt":   datetime.utcnow().isoformat()
    }

    data = read_data()
    data["contacts"].insert(0, entry)
    write_data(data)

    return jsonify(entry), 201

@app.route("/api/contacts/<contact_id>", methods=["DELETE"])
def delete_contact(contact_id):
    data = read_data()
    data["contacts"] = [c for c in data["contacts"] if c["id"] != contact_id]
    write_data(data)
    return jsonify({"deleted": contact_id})

# ── Ideas ──
@app.route("/api/ideas", methods=["GET"])
def get_ideas():
    data = read_data()
    return jsonify(data["ideas"])

@app.route("/api/ideas", methods=["POST"])
def add_idea():
    body = request.get_json()
    if not body or not body.get("text"):
        return jsonify({"error": "text is required"}), 400

    entry = {
        "id":        str(uuid.uuid4()),
        "text":      body["text"].strip(),
        "pinned":    body.get("pinned", False),
        "createdAt": datetime.utcnow().isoformat()
    }

    data = read_data()
    data["ideas"].insert(0, entry)
    write_data(data)

    return jsonify(entry), 201

@app.route("/api/ideas/<idea_id>", methods=["PATCH"])
def update_idea(idea_id):
    body = request.get_json()
    data = read_data()
    for idea in data["ideas"]:
        if idea["id"] == idea_id:
            if "pinned" in body:
                idea["pinned"] = body["pinned"]
            if "text" in body:
                idea["text"] = body["text"].strip()
    write_data(data)
    return jsonify({"updated": idea_id})

@app.route("/api/ideas/<idea_id>", methods=["DELETE"])
def delete_idea(idea_id):
    data = read_data()
    data["ideas"] = [i for i in data["ideas"] if i["id"] != idea_id]
    write_data(data)
    return jsonify({"deleted": idea_id})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
