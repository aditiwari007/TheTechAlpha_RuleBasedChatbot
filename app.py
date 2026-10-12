import re

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

MAX_MESSAGE_LENGTH = 4000
FALLBACK_RESPONSE = (
    "Sorry, I don't know the answer to that question yet. "
    "Please try asking something else."
)

RESPONSES = {
    "wellbeing": "I'm doing well, thanks for asking! How can I help you?",
    "greeting": "Hello! How can I help you today?",
    "python": (
        "Python is a popular, beginner-friendly programming language. "
        "It is used for web development, automation, data analysis, and more."
    ),
    "artificial_intelligence": (
        "Artificial intelligence (AI) is the field of building computer systems "
        "that perform tasks which usually require human intelligence, such as "
        "recognizing patterns or understanding language."
    ),
    "machine_learning": (
        "Machine learning is a part of AI where computers learn patterns from "
        "examples to make predictions or decisions."
    ),
    "flask": (
        "Flask is a lightweight Python web framework. It helps you create web "
        "applications and routes, such as this chatbot's /api/chat endpoint."
    ),
    "identity": "I'm a simple rule-based chatbot built with Python and Flask.",
    "capabilities": (
        "I can answer a few common questions about greetings, Python, AI, "
        "machine learning, and Flask. I use keyword rules, so I can't answer "
        "every question."
    ),
    "thanks": "You're welcome!",
    "goodbye": "Goodbye! Have a great day.",
    "weather": "I can't check live weather, but you can find a current forecast in a weather app.",
}

RULES = {
    "wellbeing": ("how are you", "how are you doing", "how do you feel", "how are u"),
    "python": ("what is python", "what's python", "define python", "python language", "python programming"),
    "artificial_intelligence": (
        "what is ai",
        "what's ai",
        "define ai",
        "what is artificial intelligence",
        "artificial intelligence",
    ),
    "machine_learning": ("machine learning", "what is ml", "define machine learning"),
    "flask": ("what is flask", "flask framework", "define flask"),
    "identity": ("who are you", "what is your name", "your name"),
    "capabilities": ("what can you do", "help", "what do you know"),
    "thanks": ("thank you", "thanks", "thx"),
    "goodbye": ("goodbye", "bye", "see you"),
    "weather": ("weather", "forecast"),
    "greeting": ("hello", "hi", "hey", "good morning", "good afternoon", "good evening"),
}


def find_response_category(message):
    """Return the first matching rule category, or None if there is no match."""
    for category, keywords in RULES.items():
        for keyword in keywords:
            if re.search(rf"\b{re.escape(keyword)}\b", message, re.IGNORECASE):
                return category
    return None


def get_bot_response(message):
    """Choose a predefined response using case-insensitive keyword matching."""
    category = find_response_category(message)
    if category is not None:
        return RESPONSES[category]
    else:
        return FALLBACK_RESPONSE


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/api/chat")
def chat():
    if not request.is_json:
        return jsonify({"error": "Send a JSON request."}), 400

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "The request body must be a JSON object."}), 400

    message = data.get("message")
    if not isinstance(message, str) or not message.strip():
        return jsonify({"error": "Please enter a message."}), 400

    message = message.strip()
    if len(message) > MAX_MESSAGE_LENGTH:
        return jsonify({"error": "Messages must be 4,000 characters or fewer."}), 400

    return jsonify({"reply": get_bot_response(message)})


if __name__ == "__main__":
    app.run()