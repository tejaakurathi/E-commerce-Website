import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Add useNavigate

function Navbar() {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate(); // ✅ Hook for navigation

    const handleLogout = () => {
        console.log('Logging out...');
        localStorage.removeItem('userID'); // ✅ Remove userID from localStorage
        navigate('/'); // ✅ Redirect to login page (assuming '/' is your login)
    };

    const handleClickHome=()=>{
        navigate('/Home')
    }
    const handlecart = () => {
        navigate('/cart')  // ✅ lowercase path to match your route
    }


    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <nav className="bg-blue-500 shadow-md px-8 py-4 flex justify-between items-center">
                <Link to={'/Home'} className="text-2xl font-bold cursor-pointer" onClick={handleClickHome}>My Shop</Link>
                <div className="flex items-center space-x-6 relative">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
                            onClick={() => setIsDropdownVisible(!isDropdownVisible)}
                        >
                            Profile
                        </button>

                        {isDropdownVisible && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-20">
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => navigate(`/order/${localStorage.getItem('userID')}`)}
                                >
                                    Orders
                                </button>
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition" onClick={handlecart}>
                        Cart
                    </button>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
