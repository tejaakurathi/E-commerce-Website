import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../Api';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post('/user', {
                name: username,
                email,
                password,
                address
            });

            console.log(response.data);
            alert('User registered successfully! Please login.');
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Signup failed. Please try again.');
        }
    };

    return (
        <div className="bg-[url('C:\Users\AMBATI\Desktop\fipkart-website-clone\client\src\image\signup_page_bgimage.jpg')] bg-cover flex justify-center items-center h-screen">
            <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>

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
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

                <div className="mb-4">
                    <label className="block mb-1">Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full mb-4">
                    Sign Up
                </button>

                <p className="text-center">
                    Already have an account? <Link to="/" className="text-blue-500 underline">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Signup;
