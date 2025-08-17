// src/components/AssetCard.jsx
import React, { useState } from "react";
import * as blockchain from "../services/blockchain";
import { Connection } from "@solana/web3.js";
import { Copy, Send, ArrowDownToLine } from "lucide-react";
import ReceiveModal from "./ReceiveModal";
import { toast } from "react-hot-toast";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function AssetCard({ coin, balance, onTransactionSuccess }) {
    if (!coin) return null;

    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showReceive, setShowReceive] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        setMessage("");
        setError("");

        toast.loading("Sending transaction...", { id: "txToast" });

        try {
            let txHashOrSignature;

            if (coin.symbol === "ETH") {
                txHashOrSignature = await blockchain.sendEth(coin.privateKey, recipient, amount);
            } else if (coin.symbol === "BTC") {
                txHashOrSignature = await blockchain.sendBtc(coin.privateKey, recipient, parseFloat(amount));
            } else if (coin.symbol === "SOL") {
                txHashOrSignature = await blockchain.sendSol(coin.privateKey, recipient, parseFloat(amount));
                setMessage("Transaction sent! Confirming...");
                await pollForSolanaConfirmation(txHashOrSignature);
            }

            if (coin.symbol === "ETH" || coin.symbol === "BTC") {
                setMessage(`Success! Tx: ${txHashOrSignature.substring(0, 10)}...`);
            } else if (coin.symbol === "SOL") {
                setMessage("Transaction confirmed!");
            }

            toast.success("Transaction successful!", { id: "txToast" });
            resetFormAndRefresh();
        } catch (err) {
            console.log(err);

            let friendlyMessage = "Transaction failed!";
            if (err.message.includes("insufficient funds")) {
                friendlyMessage = "Insufficient funds for this transaction. Please check your balance.";
            } else if (err.message.includes("nonce")) {
                friendlyMessage = "Transaction failed due to a nonce error. Try again later.";
            } else if (err.message) {
                friendlyMessage = err.message;
            }

            setError(friendlyMessage);
            toast.error(friendlyMessage, { id: "txToast" });
            setSending(false);
        }
    };

    const pollForSolanaConfirmation = async (signature) => {
        const solscanLink = `https://solscan.io/tx/${signature}`;
        const connection = new Connection(blockchain.SOL_RPC_URL);
        let confirmed = false;

        for (let i = 0; i < 30; i++) {
            const status = await connection.getSignatureStatus(signature, {
                searchTransactionHistory: true,
            });
            if (
                status &&
                status.value &&
                (status.value.confirmationStatus === "confirmed" ||
                    status.value.confirmationStatus === "finalized")
            ) {
                setMessage(
                    <span>
                        ✅ Success!{" "}
                        <a
                            href={solscanLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-yellow-400"
                        >
                            View on Solscan
                        </a>
                    </span>
                );
                toast.success("SOL transaction confirmed!");
                confirmed = true;
                resetFormAndRefresh();
                break;
            }
            await sleep(2000);
        }

        if (!confirmed) {
            setError(
                <span>
                    ⏳ Confirmation timed out.{" "}
                    <a
                        href={solscanLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-red-400"
                    >
                        Check Solscan
                    </a>
                </span>
            );
            toast.error("SOL confirmation timed out.");
            setSending(false);
        }
    };

    const resetFormAndRefresh = () => {
        setRecipient("");
        setAmount("");
        setSending(false);
        if (onTransactionSuccess) onTransactionSuccess();
    };

    const copyAddress = () => {
        navigator.clipboard.writeText(coin.address);
        toast.success("Address copied to clipboard!");
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-600/30 rounded-2xl p-6 shadow-lg hover:shadow-yellow-500/20 transition duration-300 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-yellow-400">{coin.name}</h3>
                    <p className="text-sm text-gray-400">{coin.symbol}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-600/20 flex items-center justify-center">
                    {/* <span className="text-yellow-400 font-bold">{coin.symbol[0]}</span> */}
                    <img className="w-ull h-full object-cover" src={coin.src} alt="" />
                </div>
            </div>

            {/* Balance */}
            <div className="mb-4">
                <p className="text-gray-400 text-sm">Balance</p>
                <p className="text-2xl font-bold text-white">
                    {balance !== null ? `${parseFloat(balance).toFixed(6)} ${coin.symbol}` : "Loading..."}
                </p>
            </div>

            {/* Wallet Address */}
            <div className="mb-4">
                <p className="text-xs text-gray-500">Address</p>
                <div className="flex items-center justify-between bg-gray-800/60 px-3 py-2 rounded-lg">
                    <p className="text-xs text-yellow-100 truncate w-40">{coin.address}</p>
                    <button
                        onClick={copyAddress}
                        className="p-1 rounded-md hover:bg-yellow-600/20 transition"
                    >
                        <Copy size={16} className="text-yellow-400" />
                    </button>
                </div>
            </div>

            {/* Send Form */}
            <form onSubmit={handleSend} className="space-y-3">
                <input
                    type="text"
                    placeholder="Recipient Address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                    className="w-full bg-gray-800/60 px-3 py-2 rounded-lg text-white text-sm focus:outline-none"
                />
                <input
                    type="text"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full bg-gray-800/60 px-3 py-2 rounded-lg text-white text-sm focus:outline-none"
                />

                <button
                    type="submit"
                    disabled={sending || !recipient || !amount}
                    className="flex items-center justify-center gap-2 w-full bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:scale-105 transition shadow-md"
                >
                    {sending && <span className="loading loading-spinner"></span>}
                    <Send size={16} /> Send {coin.symbol}
                </button>
            </form>

            {/* Receive */}
            <div className="mt-3">
                <button
                    onClick={() => {
                        setShowReceive(true);
                        toast("Opened receive modal!");
                    }}
                    className="flex items-center justify-center gap-2 w-full bg-gray-700 text-yellow-300 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition shadow-md"
                >
                    <ArrowDownToLine size={16} /> Receive
                </button>
            </div>
            {showReceive && (
                <ReceiveModal coin={coin} onClose={() => setShowReceive(false)} />
            )}

            {/* Alerts */}
            {message && (
                <div role="alert" className="mt-4 text-green-400 text-sm bg-green-900/30 p-2 rounded-lg">
                    {message}
                </div>
            )}
            {error && (
                <div role="alert" className="mt-4 text-red-400 text-sm bg-red-900/30 p-2 rounded-lg">
                    {error}
                </div>
            )}
        </div>
    );
}

export default AssetCard;
