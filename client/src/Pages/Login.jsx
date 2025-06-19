import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../Api';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 🚀 Redirect if already logged in
    useEffect(() => {
        const userID = localStorage.getItem('userID');
        if (userID) {
            navigate('/Home');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await API.get(`/user?name=${username}&password=${password}`);
            console.log('API response:', response.data);
            if (response.data) {
                const user = response.data.user;
                localStorage.setItem('userID', user.userID);

                navigate('/Home');
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            console.error(err);
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="bg-[url('C:/Users/AMBATI/Desktop/fipkart-website-clone/client/src/image/login_page_bgimage.jpg')] bg-cover bg-center flex justify-center items-center w-screen h-screen">
            <form onSubmit={handleLogin} className="bg-white border-black p-6 rounded-xl shadow-2xl w-96" autoComplete="on">
                <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="mb-4">
                    <label className="block mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4">
                    Login
                </button>

                <p className="text-center">
                    New user? <Link to="/Signup" className="text-blue-500 underline">Sign Up</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
