import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import networks from "./utils/networks";
function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [network, setNetwork] = useState("");
  const [loading, setLoading] = useState(true);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Metamask is not installed");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (e) {
      console.log(e);
    }
  };

  const checkWalletConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask");
      return;
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      setCurrentAccount(accounts[0]);
      console.log("Found an unautorized account: ", accounts[0]);
    } else {
      console.log("Could not find an unauthorised account");
    }

    const chainId = await ethereum.request({ method: "eth_chainId" });
    setNetwork(networks[chainId]);

    ethereum.on("chainChanged", handleChainChanged);

    const handleChainChanged = (_chain) => {
      setNetwork(networks[chainId]);
      window.location.reload();
    };
  };

  useEffect(() => {
    checkWalletConnected();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    <div>Hello welcome to my app</div>;
  }
}

export default App;
