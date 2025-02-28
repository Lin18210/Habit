import {createContext, useContext, useState } from "react";

const HabitContext = createContext();

export const HabitProvider = ({children}) => {
    const [habits, setHabits] = useState([])

    const addHabit = (newHabit) => {
        const habit = {
            id : Date.now(),
            name : newHabit,
            completed : false, 
            createdAt : new Date(),
            completedDates : [] 
        };
        setHabits([...habits, habit])
    }

    const deleteHabit = (id) => {
        setHabits(habits.filter((habit) => habit.id !== id))
    }

    const toggleHabit = (id) => {
        const today = new Date().toISOString().split("T")[0];
        setHabits(habits.map((habit) => {
            if (habit.id === id) {
                const isCompleted = !habit.completed
                const completedDates = isCompleted ? [...habit.completedDates, today] : habit.completedDates.filter(date => date !== today)

                return {
                    ...habit,completed : isCompleted, completedDates
                }
            }
            return habit;
        }))
    }
    return(
        <HabitContext.Provider value={{habits, addHabit, deleteHabit, toggleHabit}}>
            {children}
        </HabitContext.Provider>
    )
}

export const useHabits = () => {
    const context = useContext(HabitContext)
    if(!context){
        throw new Error(`useHabits must be used within a HabitProvider`)
    }
    return context
}