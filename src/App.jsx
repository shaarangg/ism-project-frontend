import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./abis/Piracy.json";
import networks from "./utils/networks";

const CONTRACT_ADDRESS = "0x74623dFDFbD24E40A82D29368486ba249CAF27A6";
const CONTRACT_ABI = abi.abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [network, setNetwork] = useState("");

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
    const handleChainChanged = (_chain) => {
      setNetwork(networks[chainId]);
      window.location.reload();
    };
    setNetwork(networks[chainId]);

    ethereum.on("chainChanged", handleChainChanged);
  };
  const checkAdmin = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );
        const address = await signer.getAddress();
        let tx = await contract.checkIsAdmin(address);
        console.log(tx);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const notConnectedContainer = () => {
    return (
      <div>
        <button onClick={connectWallet}>Connect Wallet</button>
      </div>
    );
  };
  const connectedContainer = () => {
    checkAdmin();
    return <div>You are successfully connected</div>;
  };

  useEffect(() => {
    checkWalletConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h1>Welcome to our project</h1>
        {!currentAccount && notConnectedContainer()}
        {currentAccount && connectedContainer()}
      </div>
    </div>
  );
}

export default App;
