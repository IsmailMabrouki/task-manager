"use client";
import './Tasks.css';  // Import the CSS file

import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

interface Task {
    id: number;
    title: string;
    description: string;
    priority: number;
    predicted_priority:number;
    status: string;
    deadline: string;
}

const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: '', deadline: '' });
    const [editTask, setEditTask] = useState<Task | null>(null);  // State to hold task being edited

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/api/tasks/prioritize', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(response.data); 
            console.log("Tasks : ", response.data);  // Assuming response.data is an array of tasks
        } catch (error) {
            console.error('Error fetching tasks', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAddTask = async () => {
        try {
            const token = localStorage.getItem('token');
            const taskData = {
                ...newTask,
                priority: parseInt(newTask.priority),
                deadline: new Date(newTask.deadline).toISOString(),
            };

            await api.post('/api/tasks', taskData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Fetch updated tasks list after adding a new task
            fetchTasks();

            setNewTask({ title: '', description: '', priority: '', deadline: '' });
            alert('Task added successfully');
        } catch (error) {
            console.error('Error adding task', error);
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/api/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Fetch updated tasks list after deleting the task
            fetchTasks();
            alert('Task deleted successfully');
        } catch (error) {
            console.error('Error deleting task', error);
        }
    };

    const handleEditTask = async (taskId: number) => {
        const taskToEdit = tasks.find((task) => task.id === taskId);
        if (taskToEdit) {
            setEditTask(taskToEdit);  // Set the task being edited to the state
        }
    };

    const handleUpdateTask = async () => {
        if (editTask) {
            try {
                const token = localStorage.getItem('token');
                const taskData = {
                    ...editTask,
                    priority: parseInt(editTask.priority.toString()),  // Ensure priority is a number
                    deadline: new Date(editTask.deadline).toISOString(),  // Convert deadline to ISO string
                };

                await api.put(`/api/tasks/${editTask.id}`, taskData, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Fetch updated tasks list after updating the task
                fetchTasks();

                setEditTask(null);  // Clear the task being edited
                alert('Task updated successfully');
            } catch (error) {
                console.error('Error updating task', error);
            }
        }
    };

    return (
        <div>
            <h1>Tasks</h1>

            {/* Add Task Form */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAddTask();
                }}
            >
                <input
                    type="text"
                    placeholder="Title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Priority"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                />
                <input
                    type="date"
                    placeholder="Deadline"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                />
                <button type="submit">Add Task</button>
            </form>

            {/* Edit Task Form */}
            {editTask && (
                <div>
                    <h2>Edit Task</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateTask();
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Title"
                            value={editTask.title}
                            onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={editTask.description}
                            onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Priority"
                            value={editTask.priority}
                            onChange={(e) => setEditTask({ ...editTask, priority: parseInt(e.target.value) })}
                        />
                        <input
                            type="date"
                            placeholder="Deadline"
                            value={editTask.deadline}
                            onChange={(e) => setEditTask({ ...editTask, deadline: e.target.value })}
                        />

                        {/* Dropdown for status */}
                        <select
                            value={editTask.status}
                            onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                        >
                            <option value="Not-started">Not started</option>
                            <option value="In-progress">In progress</option>
                            <option value="Complete">Complete</option>
                        </select>

                        <button type="submit">Update Task</button>
                    </form>
                </div>
            )}

            {/* Task List */}
            <ul>
                <p> Sort tasks by predicted priority (lower predicted_priority indicates higher priority)
                </p>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <strong>{task.title}</strong><br />
                        {task.description}<br />
                        Priority: {task.priority}<br />
                        predicted_priority: {task.predicted_priority}<br />
                        Status: {task.status} <br />
                        Deadline: {task.deadline}<br />
                        <button onClick={() => handleEditTask(task.id)}>Edit</button>
                        <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tasks;
