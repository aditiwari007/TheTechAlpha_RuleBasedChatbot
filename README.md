# Rule-Based Chatbot

A beginner-friendly chatbot website built with HTML, CSS, JavaScript, and Python Flask. The backend uses Python dictionaries, functions, conditions, and keyword matching to select a response. It does not use an AI API, API key, paid model, or external AI service.

The chatbot recognizes a small set of common questions about greetings, Python, artificial intelligence, machine learning, Flask, and a few everyday phrases. It returns a friendly fallback when a question does not match a rule. It does not generate new knowledge or access the internet.

## Features

- Case-insensitive keyword matching with multiple phrase variations
- Predefined responses and a friendly fallback for unknown questions
- Responsive chat interface, suggested questions, loading indicator, and Clear chat button
- Input validation and friendly error messages

## Technologies

- Python 3.10 or newer
- Flask
- HTML, CSS, and vanilla JavaScript

## Project structure

```text
simple-ai-chatbot/
|-- app.py
|-- requirements.txt
|-- .gitignore
|-- README.md
|-- templates/
|   `-- index.html
`-- static/
    |-- style.css
    `-- script.js
```

## Setup

1. Install Python 3.10 or newer from [python.org](https://www.python.org/downloads/). During Windows installation, select **Add Python to PATH**.
2. Open this `simple-ai-chatbot` folder in VS Code, then open its integrated terminal.
3. Create and activate a virtual environment:

   **Windows PowerShell**

   ```powershell
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

   **macOS or Linux**

   ```sh
   python3 -m venv .venv
   source .venv/bin/activate
   ```

4. Install the packages:

   ```sh
   python -m pip install -r requirements.txt
   ```

## Run the project

With the virtual environment active, start Flask from the project folder:

```sh
python app.py
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser. No API key or internet connection is needed for chatbot responses.

## Example questions

- Explain photosynthesis in simple terms.
- How are you?
- What is Python?
- What is artificial intelligence?
- Explain machine learning.
- What is Flask?
- Tell me about an unfamiliar topic. (This returns the fallback response.)

## Security notes

- This project does not collect or require API keys, and does not send messages to an external AI service.
- Keep Python dependencies up to date, and avoid exposing the Flask development server publicly.
- The chatbot does not store messages after the page is cleared or refreshed.

## Prepare for GitHub and LinkedIn

Before pushing, confirm `git status` shows only the files you intend to share and that `.gitignore` is present. Add the source files and README to a GitHub repository, then include the repository link, a short description of the Flask rule-matching flow, and an interface screenshot in your internship portfolio or LinkedIn project entry.