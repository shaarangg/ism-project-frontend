import React, { useEffect } from "react";
import { GlobalContext } from "../context";
import Connected from "../components/Connected";
import NotConnected from "../components/NotConnected";
function Home() {
    const { checkWalletConnected, currentAccount } = GlobalContext();
    useEffect(() => {
        checkWalletConnected();
    }, []);

    return (
        <div className="App">
            <div className="container">
                <h1>Welcome to our project</h1>
                {!currentAccount && <NotConnected />}
                {currentAccount && <Connected />}
            </div>
        </div>
    );
}
export default Home;
