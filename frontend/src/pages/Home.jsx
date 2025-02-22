import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <div className="bg-custom-gray min-h-screen text-white">
            <Navbar />

            <div className="container mx-auto px-4 py-20 pt-25">

                <h1 className="text-5xl font-bold text-center mb-8">
                    Crypto Deposit
                </h1>

                <p className="text-2xl text-center text-gray-300 mb-12">
                    Our platform enables seamless crypto deposits for staking, trading, and more.
                </p>

                <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-semibold mb-6 text-blue-400">
                        Key Features
                    </h2>

                    <ul className="space-y-4 text-xl text-gray-200">
                        <li className="flex items-start">
                            <span className="text-blue-400 mr-3">✔</span>
                            <span>
                                <strong>Wallet Generation:</strong> A unique wallet is created for each user upon signup and securely stored.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-400 mr-3">✔</span>
                            <span>
                                <strong>Deposit Process:</strong> Users select a coin and network to view their deposit address and deposit their crypto on that address.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-400 mr-3">✔</span>
                            <span>
                                <strong>Real-Time Monitoring:</strong> Our indexer continuously tracks blockchain transactions.
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-blue-400 mr-3">✔</span>
                            <span>
                                <strong>Instant Balance Updates:</strong> Deposits are detected and reflected in the user's account automatically.
                            </span>
                        </li>
                    </ul>
                </div>

                <p className="text-2xl text-center text-gray-300 mt-8">
                    A secure and efficient solution for managing crypto deposits with real-time tracking.
                </p>
            </div>
        </div>
    );
};

export default Home;