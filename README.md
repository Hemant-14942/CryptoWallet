# 💰 CryptoWallet

A learning project for building a **non-custodial multi-chain cryptocurrency wallet**.  
It allows users to generate a **12-word recovery seed**, manage wallets for  
**Ethereum, Bitcoin, and Solana**, and interact with the [GetBlock API](https://getblock.io/)  
to fetch balances and send/receive cryptocurrency.  

---

## ✨ Features
- 🔑 User authentication (username + password stored in MongoDB).  
- 📝 Generate a 12-word recovery phrase (BIP39 standard).  
- 🔒 Encrypt & store seed locally in browser storage.  
- 📥 Import wallet from recovery phrase.  
- 💳 View balances for Ethereum, Bitcoin, and Solana.  
- 📤 Send & 📥 receive cryptocurrency.  
- 📜 Transaction history view.  

---

## 🛠 Tech Stack
**Frontend:** React  
**Backend:** Node.js + Express  
**Database:** MongoDB (only for user login credentials)  
**Blockchain API:** GetBlock  

---

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/cryptowallet.git
cd cryptowallet
