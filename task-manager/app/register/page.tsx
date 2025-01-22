"use client"; // This marks the component as a client component.

import React, { useState } from 'react';
import api from '../../utils/api'

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            alert('Registration successful');
        } catch (error) {
            console.error('Error during registration', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
