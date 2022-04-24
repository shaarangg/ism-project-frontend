import React from "react";
import { GlobalContext } from "../context";
function Navbar() {
    const { currentAccount } = GlobalContext();
    return (
        <nav className="nav-center">
            <div className="nav-header">ISM-PROJECT</div>
            <div className="user-name">
                {currentAccount ? currentAccount : "Connect Wallet"}
            </div>
        </nav>
    );
}
export default Navbar;
