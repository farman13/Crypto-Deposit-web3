import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
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


                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <Link
                        to='/depositcrypto'
                        className="bg-yellow-300 font-medium text-black px-4 py-2 rounded hover:bg-yellow-400 transition-colors cursor-pointer"
                    >
                        Deposit Crypto
                    </Link>
                </div>

                {!localStorage.getItem("userId") ?
                    <Link
                        to="/signup"
                        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors"
                    >
                        Signup
                    </Link>
                    : <button
                        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        Log out
                    </button>
                }
            </div>
            <hr className='m-4' />
        </nav>
    );
}

export default Navbar;