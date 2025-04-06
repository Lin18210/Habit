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
              placeholder="Add a task..."
              className="flex-1 border border-slate-600 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-700 text-slate-200"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-sm"
            >
              I Got This!
            </button>
          </form>
        </div>

        <div className="space-y-3">
          {habits.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-400 mb-2">No tasks yet. Add one to get started!</p>
            </div>
          ) : (
            habits.map((habit) => (
              <div key={habit.id} className="flex items-center justify-between bg-slate-700/70 p-4 rounded-md border border-slate-600 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3"> 
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={habit.completed}
                      onChange={() => toggleHabit(habit.id)}
                      className="h-5 w-5 text-blue-500 rounded-full focus:ring-blue-500 bg-slate-600 border-slate-500"
                    />
                    {habit.completed && (
                      <span className="absolute inset-0 flex items-center justify-center text-white">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className={`${habit.completed ? 'line-through text-slate-400' : 'text-slate-200'} transition-colors`}>
                    {habit.name}
                  </span>
                </div>

                <button 
                  onClick={() => deleteHabit(habit.id)}
                  className="text-slate-300 bg-transparent p-1 rounded-full hover:bg-slate-600 transition-colors" 
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </>
    )
}

export default HabitList