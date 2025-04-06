import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        try {
            await register(username, email, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-slate-800 rounded-lg shadow-md border border-slate-700">
            <h2 className="text-2xl font-bold mb-6 text-center text-slate-100">Register</h2>
            
            {error && (
                <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-slate-300 text-sm font-medium mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-700 text-slate-200"
                        required
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-slate-300 text-sm font-medium mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-700 text-slate-200"
                        required
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-slate-300 text-sm font-medium mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-700 text-slate-200"
                        required
                    />
                </div>
                
                <div className="mb-6">
                    <label className="block text-slate-300 text-sm font-medium mb-2" htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-700 text-slate-200"
                        required
                    />
                </div>
                
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Register
                </button>
            </form>
            
            <div className="mt-4 text-center">
                <p className="text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;