// src/components/WalletDashboard.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useWallet } from '../context/WalletContext';
import AssetCard from './AssetCard.jsx';
import { getEthBalance, getSolBalance, getBtcBalance } from '../services/blockchain';
import { ShieldAlert, Lock, RefreshCcw ,Eye, EyeOff} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Login from './Login.jsx';

function WalletDashboard() {
    const navigate = useNavigate();
    const { wallet, logout } = useWallet();
    const [balances, setBalances] = useState({ eth: null, sol: null, btc: null });
    const [loading, setLoading] = useState(false);
    const [showMnemonic, setShowMnemonic] = useState(false);

    const fetchBalances = useCallback(async () => {
        if (!wallet || !wallet.ethereum || !wallet.bitcoin || !wallet.solana) return;

        try {
            setLoading(true);
            const [eth, sol, btc] = await Promise.all([
                getEthBalance(wallet.ethereum.address),
                getSolBalance(wallet.solana.address),
                getBtcBalance(wallet.bitcoin.address)
            ]);
            setBalances({ eth, sol, btc });
            toast.success("Balances updated successfully!");
        } catch (error) {
            console.error("Failed to fetch all balances:", error);
            toast.error("Failed to fetch balances!");
        } finally {
            setLoading(false);
        }
    }, [wallet]);

    useEffect(() => {
        fetchBalances();
        const interval = setInterval(fetchBalances, 30000);
        return () => clearInterval(interval);
    }, [fetchBalances]);

    if (!wallet || !wallet.ethereum || !wallet.bitcoin || !wallet.solana) {
        return <Login />;
    }

    const coins = [
        { name: 'Ethereum', symbol: 'ETH', ...wallet.ethereum ,src:"/etherium2.png"},
        { name: 'Solana', symbol: 'SOL', ...wallet.solana, src:"/solana1.png" },
        { name: 'Bitcoin', symbol: 'BTC', ...wallet.bitcoin ,src:"/btc.png"},
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-yellow-200 p-4 sm:p-6 md:p-8">
            
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-yellow-600/30 pb-4">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-yellow-400 drop-shadow-lg tracking-wide">
                    VaultX Dashboard
                </h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button 
                        onClick={fetchBalances}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 py-2 px-4 sm:px-5 rounded-xl font-semibold text-yellow-200 bg-black border border-yellow-600 hover:bg-yellow-600/20 transition-all shadow-lg"
                    >
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                        {loading ? "Refreshing..." : "Refresh"}
                    </button>
                    <button 
                        onClick={()=>{
                            logout();
                            toast("You have been logged out!", { icon: '🔒' });
                        }} 
                        className="flex items-center justify-center gap-2 py-2 px-4 sm:px-5 rounded-xl font-semibold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 hover:scale-105 transform transition-all shadow-lg"
                    >
                        <Lock size={18} />
                        Logout & Lock
                    </button>
                </div>
            </header>

            {/* Mnemonic Warning */}
             <div className="bg-black/60 backdrop-blur-md border border-yellow-600/40 p-4 sm:p-6 rounded-2xl shadow-xl mb-8 relative overflow-hidden">
      <p className="font-bold text-yellow-300 mb-2 flex items-center gap-2 text-sm sm:text-base">
        <ShieldAlert size={18} className="text-yellow-500 shrink-0" />
        Your Mnemonic Phrase (Keep it secret!)
      </p>

      <div className="bg-gray-900/60 p-3 sm:p-4 rounded-lg border border-yellow-600/30 relative">
        {/* Mnemonic text (hidden or visible) */}
        <p className="font-mono text-xs sm:text-sm break-words text-yellow-100 pr-12">
          {showMnemonic ? wallet.mnemonic : "•••• •••• •••• •••• •••• •••• •••• ••••"}
        </p>

        {/* Toggle button */}
        <button
          onClick={() => setShowMnemonic(!showMnemonic)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-yellow-400 hover:text-yellow-200 transition"
        >
          {showMnemonic ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>

            {/* Assets Section */}
            <div>
                <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-6">Your Assets</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {coins.map(coin => (
                        <AssetCard
                            key={coin.symbol}
                            coin={coin}
                            balance={balances[coin.symbol.toLowerCase()]}
                            onTransactionSuccess={()=>{
                                fetchBalances();
                                toast.success(`${coin.name} transaction completed!`);
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WalletDashboard;
