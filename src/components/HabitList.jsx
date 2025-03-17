import { useState } from "react"
import { useHabits } from "./HabitContext"

const HabitList = () => {
    const {habits, addHabit, deleteHabit, toggleHabit} = useHabits();
    const [newHabit, setNewHabit] = useState("") 

    const handleAddNewHabit = (e) => {
      e.preventDefault();
      if(newHabit.trim() === "") return;
      addHabit(newHabit)
      setNewHabit("")
    }

    return(
      <>
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleAddNewHabit} className="flex gap-2 mb-6">
            <input 
            type="text" 
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add a new habit :)"
            className="flex-1 border p-2 rounded"
            />
            <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
            >
              Add
            </button>
          </form>
        </div>

        <div>
          {habits.map((habit) => (
            <div key={habit.id} className="flex items-center justify-between bg-white p-4 rounded shadow">
              <div className="flex items-center gap-3"> 
                <input 
                type="checkbox" 
                checked={habit.completed}
                onChange={() => toggleHabit(habit.id)}/>
                <span className={`${habit.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {habit.name}
                </span>
              </div>

              <button 
              onClick={() => deleteHabit(habit.id)}
              className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 cursor-pointer" 
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </>
    )
}

export default HabitList