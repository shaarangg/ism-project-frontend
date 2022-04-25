import React from "react";
import { GlobalContext } from "../context";
function NotConnected() {
    const { connectWallet } = GlobalContext();
    return (
        <div className="home-container">
            <button className="home-btn" onClick={connectWallet}>
                Connect Wallet
            </button>
        </div>
    );
}

export default NotConnected;
