# Task Manager

A simple Task Manager web application built with **Flask** for the backend and **React.js** with **Next.js** for the frontend. The application allows users to manage tasks, set priorities, and organize their work efficiently.

---

## Features

- **Backend (Flask)**: REST API to handle task management, user authentication, and other backend functionalities.
- **Frontend (React.js with Next.js)**: Dynamic user interface to interact with the backend API and display tasks.
- **Model**: Pre-trained model to assist in task priority prediction (refer to the link below for the model in Google Colab).

---

## Technologies Used

### Backend

- **Flask**: A lightweight WSGI web application framework in Python.
- **SQLAlchemy**: ORM for database interaction.
- **Flask-RESTful**: For creating REST APIs in Flask.

### Frontend

- **React.js**: A JavaScript library for building user interfaces.
- **Next.js**: A React framework for building server-side rendered web applications.

---

## Installation

### Backend (Flask)

1. Clone the repository:

   ```bash
   git clone https://github.com/IsmailMabrouki/task-manager.git
   cd task-manager
   ```

2. Set up a virtual environment:

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required dependencies:
   If you don't have a `requirements.txt` yet, manually install Flask and the necessary libraries:

   ```bash
   pip install Flask Flask-RESTful SQLAlchemy
   ```

4. Set environment variables (e.g., Flask app settings):

   - Create a `.env` file inside the `backend/` directory and add the necessary variables like database URL, secret keys, etc.

5. Run the Flask application:

   ```bash
   python backend/run.py
   ```

---

### Frontend (React.js with Next.js)

1. Navigate to the frontend directory:

   ```bash
   cd task-manager
   cd frontend
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Start the Next.js development server:

   ```bash
   npm run dev
   ```

4. Open your browser and go to `http://localhost:3000` to view the application.

---

## Model for Task Priority Prediction

The task manager also includes a machine learning model for predicting task priorities. The model is trained using historical task data and is used to help prioritize tasks based on certain features.

### Steps to Download and Add the Model:

1. **Access the Model on Google Colab:**
   You can access the pre-trained model and the code used for training and evaluation in the following [Google Colab Notebook](https://colab.research.google.com/drive/1pG8QLEUAlELmGHVfLMSgMBQ6MzDoWu9m?usp=sharing).

2. **Download the Model File:**
   In the Colab notebook, locate the section where the model is saved as a `.pkl` file. Download the model file (`task_priority_model.pkl`) to your local machine.

3. **Add the Model to the Project:**
   After downloading the model, place the `.pkl` file into the `backend/models/` directory of your project. The file path should look like this:

   ```bash
   task-manager/
     ├── backend/
         ├── models/
             └── task_priority_model.pkl
   ```

4. **Ensure the File is Available:**
   Verify that the model file is in the correct location inside your project structure. It should be placed inside the `backend/models/` directory to be accessed by the backend application for predictions.

---

## Contribution

Feel free to contribute by:

- Forking the repository
- Cloning your fork locally
- Making improvements and submitting a pull request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- Flask for the backend framework.
- React.js and Next.js for the frontend framework.
- Google Colab for model training and evaluation.

```

```
