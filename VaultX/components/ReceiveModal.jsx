import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

function ReceiveModal({ coin, onClose }) {
  const [copied, setCopied] = useState(false);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!coin) return null;

  // Copy address function
  const handleCopy = () => {
    navigator.clipboard.writeText(coin.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="receive-title"
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose} // click outside to close
    >
      <div
        className="bg-gray-900 border border-yellow-600/40 rounded-2xl p-6 w-11/12 max-w-md text-center shadow-xl relative"
        onClick={(e) => e.stopPropagation()} // prevent modal itself from closing
      >
        {/* Title */}
        <h2
          id="receive-title"
          className="text-xl font-bold text-yellow-400 mb-4"
        >
          Receive {coin.name}
        </h2>

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          <QRCodeSVG
            value={coin.address}
            size={Math.min(window.innerWidth * 0.5, 200)}
            bgColor="#000000"
            fgColor="#FFD700"
          />
        </div>

        {/* Wallet Address */}
        <p className="text-yellow-100 text-xs truncate mb-3">{coin.address}</p>

        {/* Buttons */}
        <div className="flex justify-between gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:scale-105 transition"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-yellow-400 rounded-lg hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>

        {/* Optional Toast Feedback */}
        {copied && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-black px-3 py-1 rounded-lg text-sm animate-pulse">
            Address Copied!
          </div>
        )}
      </div>
    </div>
  );
}

export default ReceiveModal;
