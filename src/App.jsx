import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HabitList from './components/HabitList'
import Calendar from './components/Calender'
import Login from './components/Login'
import Register from './components/Register'
import { HabitProvider } from './components/HabitContext'
import { AuthProvider } from './components/AuthContext'

const App = () => {
  return(
    <AuthProvider>
      <HabitProvider>
        <Router>
          <div className='min-h-screen bg-slate-900 text-slate-100'>
            <div className='container mx-auto px-4 py-8 max-w-2xl'>
              <h1 className='text-4xl font-bold text-center mb-10 text-slate-100 '>Habit Tracker</h1>
              <Navbar/>
              <div className='bg-slate-800/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-slate-700'>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path='/' element={<HabitList />} />
                  <Route path='/calender' element={<Calendar />} />
                </Routes>
              </div>
              <div className="mt-8 text-center text-slate-500 text-sm">
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </Router>
      </HabitProvider>
    </AuthProvider>
  )
}

export default App
