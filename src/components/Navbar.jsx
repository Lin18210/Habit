import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return(
        <nav className="flex justify-between items-center mb-8">
            <div className="flex gap-6">
                {user && (
                    <>
                        <NavLink 
                            to='/' 
                            className={({isActive}) => `px-4 py-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'}`}>
                            Habits
                        </NavLink>
                        <NavLink 
                            to='/calender'
                            className={({isActive}) => `px-4 py-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'}`} >
                            Calender
                        </NavLink>
                    </>
                )}
            </div>
            
            <div>
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">Hello, {user.username}</span>
                        <button 
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <NavLink 
                            to='/login'
                            className={({isActive}) => `px-4 py-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'}`}>
                            Login
                        </NavLink>
                        <NavLink 
                            to='/register'
                            className={({isActive}) => `px-4 py-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'}`}>
                            Register
                        </NavLink>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar