import { NavLink } from "react-router-dom"

const Navbar = () => {
    return(
        <nav className="flex justify-center gap-6 mb-8">
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
        </nav>
    )
}

export default Navbar