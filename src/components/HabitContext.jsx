import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const HabitContext = createContext();
const API_URL = 'http://localhost:5001/api';  

// Separate the hook from the provider for Fast Refresh compatibility
function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error(`useHabits must be used within a HabitProvider`);
  }
  return context;
}

function HabitProvider({ children }) {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchHabits();
        } else {
            setHabits([]);
            setLoading(false);
        }
    }, [user]);

    const fetchHabits = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${API_URL}/habits`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch habits');
            }
            
            const data = await response.json();
            setHabits(data);
        } catch (error) {
            console.error('Error fetching habits:', error);
        } finally {
            setLoading(false);
        }
    };

    const addHabit = async (newHabit) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${API_URL}/habits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newHabit })
            });
            
            if (!response.ok) {
                throw new Error('Failed to add habit');
            }
            
            const habit = await response.json();
            setHabits([...habits, habit]);
        } catch (error) {
            console.error('Error adding habit:', error);
        }
    };

    const deleteHabit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${API_URL}/habits/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete habit');
            }
            
            setHabits(habits.filter((habit) => habit.id !== id));
        } catch (error) {
            console.error('Error deleting habit:', error);
        }
    };

    const toggleHabit = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const today = new Date().toISOString().split("T")[0];
            
            const response = await fetch(`${API_URL}/habits/${id}/toggle`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ date: today })
            });
            
            if (!response.ok) {
                throw new Error('Failed to toggle habit');
            }
            
            const updatedHabit = await response.json();
            setHabits(habits.map(habit => habit.id === id ? updatedHabit : habit));
        } catch (error) {
            console.error('Error toggling habit:', error);
        }
    };

    return (
        <HabitContext.Provider value={{ habits, addHabit, deleteHabit, toggleHabit, loading }}>
            {children}
        </HabitContext.Provider>
    );
}

export { HabitProvider, useHabits };