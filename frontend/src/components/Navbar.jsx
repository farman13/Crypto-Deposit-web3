import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userId"));

    const handleLogout = () => {
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
    };

    return (
        <nav className="bg-custom-gray p-4 fixed w-full top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">

                <Link to="/" className="text-white text-2xl font-bold">
                    My Crypto App
                </Link>

                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <Link
                        to='/depositcrypto'
                        className="bg-yellow-300 font-medium text-black px-4 py-2 rounded hover:bg-yellow-400 transition-colors cursor-pointer"
                    >
                        Deposit Crypto
                    </Link>
                </div>

                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        Log out
                    </button>
                ) : (
                    <Link
                        to="/signup"
                        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors"
                    >
                        Signup
                    </Link>
                )}
            </div>
            <hr className='m-4' />
        </nav>
    );
}

export default Navbar;
