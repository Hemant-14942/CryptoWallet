import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { generateMnemonic } from '../services/wallets';
import { useNavigate} from 'react-router-dom';


function Login() {
    const [mnemonic, setMnemonic] = useState('');
    const [newMnemonic, setNewMnemonic] = useState('');
    const [error, setError] = useState('');
    const { login } = useWallet();
    const Navigate = useNavigate();

    const handleImport = async (e) => {
        e.preventDefault();
        if (!mnemonic.trim() || mnemonic.trim().split(' ').length !== 12) {
            setError('Please enter a valid 12-word mnemonic phrase.');
            return;
        }
        try {
            setError('');
            await login(mnemonic.trim());
            Navigate("/walletdashboard");
        } catch (err) {
            setError('Invalid mnemonic phrase. Please check and try again.');
        }
    };

    const handleCreate = () => setNewMnemonic(generateMnemonic());
    const proceedWithNewMnemonic = async () =>{
         await login(newMnemonic);
         Navigate("/walletdashboard");
    }

    if (newMnemonic) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-yellow-300">
                <div className="max-w-md w-full bg-black/40 backdrop-blur-md border border-yellow-600/30 p-8 rounded-2xl shadow-2xl">
                    <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">Save Your Secret Phrase</h2>
                    
                    <div className="bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-200 p-4 rounded-md mb-6">
                        <p className="font-bold">⚠️ IMPORTANT</p>
                        <p>Write this 12-word phrase down. It's the only way to recover your wallet.</p>
                    </div>
                    
                    <div className="bg-black/70 p-4 rounded-lg text-center font-mono text-lg tracking-wider text-yellow-200 shadow-inner">
                        {newMnemonic}
                    </div>
                    
                    <button 
                        onClick={proceedWithNewMnemonic} 
                        className="w-full mt-6 py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 hover:scale-105 transform transition-all shadow-lg"
                    >
                        I've Saved It, Continue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-yellow-300">
            <h1 className="text-4xl font-bold text-center mb-10 text-yellow-400 drop-shadow-lg">
                Simple Crypto Wallet
            </h1>

            {/* Import Wallet */}
            <div className="w-full max-w-lg bg-black/40 backdrop-blur-md border border-yellow-600/30 p-8 rounded-2xl shadow-2xl mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-yellow-300">Import Existing Wallet</h2>
                <form onSubmit={handleImport}>
                    <textarea
                        value={mnemonic}
                        onChange={(e) => setMnemonic(e.target.value)}
                        placeholder="Enter your 12-word mnemonic phrase..."
                        className="w-full p-3 border border-yellow-700 rounded-lg bg-black/70 text-yellow-200 focus:ring-2 focus:ring-yellow-500 outline-none transition"
                        rows="3"
                    />
                    <button 
                        type="submit" 
                        className="mt-4 w-full py-3 rounded-xl font-semibold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 hover:scale-105 transform transition-all shadow-lg"
                    >
                        Import Wallet
                    </button>
                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                </form>
            </div>

            {/* Create New Wallet */}
            <div className="w-full max-w-lg bg-black/40 backdrop-blur-md border border-yellow-600/30 p-8 rounded-2xl shadow-2xl">
                <h2 className="text-2xl font-semibold mb-2 text-yellow-300">Create a New Wallet</h2>
                <p className="text-yellow-200/70 mb-4">No wallet yet? Create one now.</p>
                <button 
                    onClick={handleCreate} 
                    className="w-full py-3 rounded-xl font-semibold text-yellow-200 border border-yellow-500 hover:bg-yellow-600/20 transition-all"
                >
                    Create New Wallet
                </button>
            </div>
        </div>
    );
}

export default Login;
