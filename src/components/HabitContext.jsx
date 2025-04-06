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
    const [localHabits, setLocalHabits] = useState([]);

    useEffect(() => {
        if (user) {
            fetchHabits();
        } else {
            // Load habits from localStorage for non-authenticated users
            const savedHabits = localStorage.getItem('localHabits');
            if (savedHabits) {
                setHabits(JSON.parse(savedHabits));
            } else {
                setHabits([]);
            }
            setLoading(false);
        }
    }, [user]);

    // Save local habits to localStorage whenever they change
    useEffect(() => {
        if (!user && habits.length > 0) {
            localStorage.setItem('localHabits', JSON.stringify(habits));
        }
    }, [habits, user]);

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
        if (user) {
            // For authenticated users
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
        } else {
            // For non-authenticated users
            const newHabitObj = {
                id: Date.now(),
                name: newHabit,
                completed: false,
                createdAt: new Date().toISOString(),
                completedDates: []
            };
            setHabits([...habits, newHabitObj]);
        }
    };

    const deleteHabit = async (id) => {
        if (user) {
            // For authenticated users
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
                
                setHabits(habits.filter(habit => habit.id !== id));
            } catch (error) {
                console.error('Error deleting habit:', error);
            }
        } else {
            // For non-authenticated users
            setHabits(habits.filter(habit => habit.id !== id));
        }
    };

    const toggleHabit = async (id, date = new Date().toISOString().split('T')[0]) => {
        if (user) {
            // For authenticated users
            try {
                const token = localStorage.getItem('token');
                
                const response = await fetch(`${API_URL}/habits/${id}/toggle`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ date })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to toggle habit');
                }
                
                const updatedHabit = await response.json();
                setHabits(habits.map(habit => 
                    habit.id === id ? updatedHabit : habit
                ));
            } catch (error) {
                console.error('Error toggling habit:', error);
            }
        } else {
            // For non-authenticated users
            setHabits(habits.map(habit => {
                if (habit.id === id) {
                    const dateExists = habit.completedDates.includes(date);
                    const updatedDates = dateExists
                        ? habit.completedDates.filter(d => d !== date)
                        : [...habit.completedDates, date];
                    
                    return {
                        ...habit,
                        completed: !habit.completed,
                        completedDates: updatedDates
                    };
                }
                return habit;
            }));
        }
    };

    return (
        <HabitContext.Provider value={{ habits, loading, addHabit, deleteHabit, toggleHabit }}>
            {children}
        </HabitContext.Provider>
    );
}

export { HabitProvider, useHabits };