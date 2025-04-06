import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import HabitList from './components/HabitList'
import Calendar from './components/Calender'
import Login from './components/Login'
import Register from './components/Register'
import { HabitProvider } from './components/HabitContext'
import { AuthProvider, useAuth } from './components/AuthContext'

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const App = () => {
  return(
    <AuthProvider>
      <HabitProvider>
        <Router>
          <div className='container mx-auto px-4 py-8 max-w-2xl'>
            <h1 className='text-3xl font-bold text-center mb-8'>Habit Tracker</h1>
            <Navbar/>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path='/' element={
                <ProtectedRoute>
                  <HabitList/>
                </ProtectedRoute>
              }/>
              <Route path='/calender' element={
                <ProtectedRoute>
                  <Calendar/>
                </ProtectedRoute>
              }/>
            </Routes>
          </div>
        </Router>
      </HabitProvider>
    </AuthProvider>
  )
}

export default App
