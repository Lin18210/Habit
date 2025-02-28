import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HabitList from './components/HabitList'
import Calendar from './components/Calender'
import { HabitProvider } from './components/HabitContext'

const App = () => {
  return(
    <HabitProvider>
    <Router>
      <div className='container mx-auto px-4 py-8 mx-w-2xl'>
        <h1 className='text-3xl font-bold text-center mb-8'>Habit Tracker</h1>
      <Navbar/>
      <Routes>
      <Route path='/' element={<HabitList/>}/>
      <Route path='/calender' element={<Calendar/>}/>
      </Routes>
      </div>
    </Router>
    </HabitProvider>
  )
}

export default App
