from flask import Flask, request, jsonify, render_template
from google.cloud import dialogflow
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:\\Users\\Davina\\Downloads\\oceanwisechatbot-tufy-ebc2e0563137.json"
dialogflow_project_id = "oceanwisechatbot-tufy"
session_client = dialogflow.SessionsClient()


def detect_intent_texts(project_id, session_id, text, language_code="en"):
    session = session_client.session_path(project_id, session_id)
    text_input = dialogflow.TextInput(text=text, language_code=language_code)
    query_input = dialogflow.QueryInput(text=text_input)
    response = session_client.detect_intent(request={"session": session, "query_input": query_input})
    return response.query_result.fulfillment_text

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/get_text_response", methods=["POST"])
def get_text_response():
    user_input = request.json.get("message", "").strip()
    if not user_input:
        return jsonify({"response": "I'm sorry, I couldn't process your request! Please ask questions related to the ocean."})
    
    session_id = request.remote_addr
    try:
        response_text = detect_intent_texts(dialogflow_project_id, session_id, user_input, "en")
    except Exception as e:
        print(f"Error communicating with Dialogflow: {e}")
        response_text = "I'm sorry, I couldn't process your request! Please ask questions related to the ocean."

    return jsonify({"response": response_text})

@app.route('/submit_plastic_tracker', methods=['POST'])
def submit_plastic_tracker():
    data = request.json
    plastic_items = data.get('plastic_items', 0)
    yearly_plastic = data.get('yearly_plastic', 0)
    lifetime_plastic = data.get('lifetime_plastic', 0)
    response = {
        "message": f"You used {plastic_items} plastic items today. That equals to {yearly_plastic} items per year and most likely {lifetime_plastic} kg worth of plastic in your lifetime if you keep this up!"
    }
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)