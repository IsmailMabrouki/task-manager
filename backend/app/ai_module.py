import joblib
import pandas as pd
from datetime import datetime
import os

model_path = os.getenv("MODEL_PATH", "models/task_priority_model1.pkl")

def load_model():
    try:
        with open(model_path, 'rb') as file:
            model = joblib.load(file)  # or joblib.load(file)
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None
# Load the trained AI model (Make sure this file is available)
# model = joblib.load('task_priority_model.pkl')

# Function to predict task priority using the AI model
def predict_task_priority(importance, history_score, deadline_str):
      # Load the model
    model = load_model()
    if not model:
        raise Exception("Model could not be loaded.")
    # Convert deadline to number of days until the deadline
    deadline = datetime.strptime(deadline_str, "%Y-%m-%d")
    days_until_deadline = (deadline - datetime.today()).days

    # Prepare input data for prediction
    task_data = pd.DataFrame([[importance, history_score, days_until_deadline]],
                             columns=['importance', 'history_score', 'days_until_deadline'])

    # Predict the task priority using the trained model
    predicted_priority = model.predict(task_data)[0]
    return predicted_priority

# Updated prioritize_tasks function with AI-based model
def prioritize_tasks(tasks):
    # For each task, predict its priority using the model
    for task in tasks:
        # Extract features for the model
        importance = task.priority  # Assuming importance is tied to task priority
        history_score = task.history_score if hasattr(task, 'history_score') else 0  # Default to 0 if no history score
        
        # Predict task priority
        predicted_priority = predict_task_priority(importance, history_score, task.deadline.strftime('%Y-%m-%d'))
        
        # Assign predicted priority to task (or use a temporary field if needed)
        task.predicted_priority = predicted_priority

    # Sort tasks by predicted priority (lower predicted_priority indicates higher priority)
    return sorted(tasks, key=lambda x: x.predicted_priority)