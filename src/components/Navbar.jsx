import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return(
        <nav className="bg-slate-800 rounded-lg shadow-md mb-8 p-3">
            <div className="flex justify-between items-center">
                <div className="flex gap-4">
                    <NavLink 
                        to='/' 
                        className={({isActive}) => `px-4 py-2 rounded-md transition-all duration-200 ${
                            isActive 
                                ? 'bg-blue-500 text-white font-medium shadow-sm' 
                                : 'text-slate-300 hover:bg-slate-700'
                        }`}>
                        Habits
                    </NavLink>
                    <NavLink 
                        to='/calender'
                        className={({isActive}) => `px-4 py-2 rounded-md transition-all duration-200 ${
                            isActive 
                                ? 'bg-blue-500 text-white font-medium shadow-sm' 
                                : 'text-slate-300 hover:bg-slate-700'
                        }`}>
                        Calendar
                    </NavLink>
                </div>
                
                <div>
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-slate-300">Hello, {user.username}</span>
                            <button 
                                onClick={handleLogout}
                                className="px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition-colors shadow-sm">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="bg-slate-700 rounded-md overflow-hidden shadow-sm">
                            <NavLink 
                                to='/login'
                                className={({isActive}) => `px-4 py-2 inline-block transition-colors ${
                                    isActive 
                                        ? 'bg-blue-500 text-white font-medium' 
                                        : 'text-slate-300 hover:bg-slate-600'
                                }`}>
                                Login
                            </NavLink>
                            <NavLink 
                                to='/register'
                                className={({isActive}) => `px-4 py-2 inline-block transition-colors ${
                                    isActive 
                                        ? 'bg-blue-500 text-white font-medium' 
                                        : 'text-slate-300 hover:bg-slate-600'
                                }`}>
                                Register
                            </NavLink>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar