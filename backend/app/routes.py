from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import Task, User
from . import db
from datetime import datetime


from .ai_module import prioritize_tasks

api = Blueprint('api', __name__)


@api.route('/tasks', methods=['POST'])
@jwt_required()
def tasks():
    user_id = get_jwt_identity()
    if request.method == 'POST':
        data = request.json
        print(f"Received data: {data}")  # Debug log
        print(f"Received id: {2}")  # Debug log
        try:
            deadline = datetime.strptime(data['deadline'], '%Y-%m-%dT%H:%M:%S.%fZ')
            print(f"Parsed deadline: {deadline}")  # Debug log
            new_task = Task(
                title=data['title'],
                description=data['description'],
                priority=data['priority'],
                deadline=deadline,
                user_id=user_id
            )
            db.session.add(new_task)
            db.session.commit()
            return jsonify({"message": "Task created"}), 201
        except KeyError as e:
            return jsonify({"msg": f"Missing field: {str(e)}"}), 400
        except ValueError as e:
            return jsonify({"msg": f"Invalid date format for 'deadline': {str(e)}"}), 400
        except Exception as e:
            return jsonify({"msg": str(e)}), 500


    tasks = Task.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
        "deadline": task.deadline.strftime('%Y-%m-%d'),
        "status": task.status
    } for task in tasks])





@api.route('/tasks/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
def task_operations(id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=id, user_id=user_id).first()

    if not task:
        return jsonify({"message": "Task not found"}), 404

    if request.method == 'PUT':
        data = request.json

        # Convert deadline string to a datetime object if present
        if 'deadline' in data:
            try:
                # If 'deadline' is in the correct ISO 8601 format, parse it
                task.deadline = datetime.fromisoformat(data['deadline'])
            except ValueError:
                return jsonify({"message": "Invalid date format. Please use ISO 8601 format."}), 400

        task.title = data.get('title', task.title)
        task.description = data.get('description', task.description)
        task.priority = data.get('priority', task.priority)
        task.status = data.get('status', task.status)
        db.session.commit()
        return jsonify({"message": "Task updated"}), 200

    if request.method == 'DELETE':
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted"}), 200

@api.route('/tasks/prioritize', methods=['GET'])
@jwt_required()
def prioritize():
    user_id = get_jwt_identity()
    tasks = Task.query.filter_by(user_id=user_id).all()
    prioritized = prioritize_tasks(tasks)
    return jsonify([{
        "id": task.id,
        "title": task.title,
        "priority": task.priority,
        "predicted_priority": task.predicted_priority,
        "description": task.description,
        "status": task.status,
        "deadline": task.deadline.strftime('%Y-%m-%d')
    } for task in prioritized])

# Explicitly handle OPTIONS requests for all routes in this blueprint
@api.route('/tasks', methods=['OPTIONS'])
@api.route('/tasks/<int:id>', methods=['OPTIONS'])
@api.route('/tasks/prioritize', methods=['OPTIONS'])
def handle_options():
    response = jsonify({"message": "Preflight successful"})
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response