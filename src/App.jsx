import { useState } from 'react'

function App() {
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')

  const addHabit = (e) => {
    e.preventDefault()
    if (!newHabit.trim()) return

    const habit = {
      id: Date.now(),
      name: newHabit,
      completed: false,
      createdAt: new Date(),
    }

    setHabits([...habits, habit])
    setNewHabit('')
  }

  const deleteHabit = (id) => {
    setHabits(habits.filter((habit) => habit.id !== id))
  }

  const toggleHabit = (id) => {
    setHabits(habits.map((habit) => 
      habit.id === id ? {...habit, completed: !habit.completed} : habit
    ))
  }

  return (
    <div className = "container mx-auto px-4 py-8 max-w-2xl ">
      <h1 className='text-3xl font-bold text-center mb-8'>Habit Tracker</h1>
        <form onSubmit={addHabit} className='flex gap-2 mb-6'>
          <input 
          type = "text"
          value = {newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder='Add a new habit :)'
          className='flex-1 p-2 border rounded'
          />
          <button type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer' 
          >Add</button>
        </form>

        <div className='space-y-3'>
          {habits.map((habit) => (
            <div key={habit.id} className='flex items-center justify-between bg-white p-4 rounded shadow'>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={habit.completed}
                  onChange={() => toggleHabit(habit.id)}
                />
                <span className={`${habit.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {habit.name}
                </span>
              </div>
              <button onClick={() => deleteHabit(habit.id)} className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-800">Delete</button>
            </div>
          ))}
        </div>

    </div>
  )
}

export default App
