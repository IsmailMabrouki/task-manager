"use client"; // This marks the component as a client component.

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../utils/api';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const router = useRouter();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const response = await api.post('auth/login', formData);
            localStorage.setItem('token', response.data.token);
            router.push('/tasks');
        } catch (error) {
            console.error('Error during login', error);
        }
    };

    const handleRegisterRedirect = () => {
        router.push('/register'); // Redirect to the register page
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
            <button type="submit">Login</button>
            <button type="button" onClick={handleRegisterRedirect}>
                Take me to Register
            </button>
        </form>
    );
};

export default Login;
