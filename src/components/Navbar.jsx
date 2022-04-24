import React from "react";
import { GlobalContext } from "../context";
function Navbar() {
    const { walletAddress } = GlobalContext();
    return (
        <nav className="nav-center">
            <div className="nav-header">ISM-PROJECT</div>
            <div className="user-name">{walletAddress}</div>
        </nav>
    );
}
export default Navbar;
