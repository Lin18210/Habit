import { response } from "express";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if(token && userData){
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, [])

    const register = async (username, email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    password 
                })
            })
            const data = await response.json();

            if(!response.ok){
                throw new Error(data.message || 'Registration failed');
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user)
            return data;
        }
        catch(error){
            console.error(error);
            throw error;
        }
    }

}
