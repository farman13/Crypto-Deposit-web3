import React, { useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const DepositCrypto = () => {
    const coinRef = useRef('');
    const networkRef = useRef('');
    const [depositAddress, setDepositAddress] = useState('');

    async function getDepositAddress() {
        const coin = coinRef.current.value;
        const network = networkRef.current.value;

        if (coin && network) {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`http://localhost:3000/depositAddress/${userId}`);
            setDepositAddress(response.data.depositAddress);
            console.log(depositAddress);
        }
    }


    const copyToClipboard = () => {
        if (depositAddress) {
            navigator.clipboard.writeText(depositAddress);
            alert('Deposit address copied to clipboard!');
        }
    };

    return (
        <div className="bg-custom-gray min-h-screen text-white">
            <Navbar />
            <div className="pt-25 flex flex-col items-center justify-center space-y-8">

                <div >
                    <label htmlFor="selectCoin" className="block text-2xl font-medium mb-2">
                        Select Coin
                    </label>
                    <select
                        id="selectCoin"
                        ref={coinRef}
                        className="bg-gray-800 text-xl text-white p-3 pr-70 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Coin</option>
                        <option value="ETH">ETH (native currency)</option>
                        <option value="APE">APE (native currency)</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="selectNetwork" className="block text-2xl font-medium mb-2">
                        Select Network
                    </label>
                    <select
                        id="selectNetwork"
                        ref={networkRef}
                        onChange={getDepositAddress}
                        className="bg-gray-800 text-xl text-white p-3 pr-85 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Network</option>
                        <option value="sepolia">Sepolia</option>
                        <option value="curtis">Curtis</option>
                    </select>
                </div>


                <div >
                    {depositAddress ?
                        <label htmlFor="depositaddress" className="block text-2xl font-medium mb-2">
                            Deposit Address
                        </label>
                        :
                        <label htmlFor="depositaddress" className="block text-2xl text-gray-500 font-medium mb-2">
                            Deposit Address
                        </label>
                    }
                    {depositAddress ? (
                        <div className="flex items-center justify-center space-x-4">
                            <h1 className="bg-gray-800 text-xl text-white p-3 pr-20 rounded-lg focus:ring-2 focus:ring-blue-500">{depositAddress}</h1>
                            <button
                                onClick={copyToClipboard}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                    ) : ""
                    }
                </div>
            </div>
        </div>
    );
};

export default DepositCrypto;