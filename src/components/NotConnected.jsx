import React from "react";
import { GlobalContext } from "../context";
function NotConnected() {
    const { connectWallet } = GlobalContext();
    return (
        <div>
            <button onClick={connectWallet}>Connect Wallet</button>
        </div>
    );
}

export default NotConnected;
