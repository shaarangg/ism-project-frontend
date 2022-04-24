import React, { useContext, useState } from "react";
import { ethers } from "ethers";
import abi from "./abis/Piracy.json";
import networks from "./utils/networks";

const CONTRACT_ADDRESS = "0x3A33136C37D9fb33de487c6e3912E0742449c00E";
const CONTRACT_ABI = abi.abi;

const ContextAPI = React.createContext();

export function AppProvider({ children }) {
    const [currentAccount, setCurrentAccount] = useState("");
    const [network, setNetwork] = useState("");
    const [walletAddress, setWalletAddress] = useState("Connect Wallet");
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
                setWalletAddress((await signer.getAddress()).toString());
                const address = await signer.getAddress();
                const tx = await contract.checkIsAdmin(address);
                return tx;
            }
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <ContextAPI.Provider
            value={{
                walletAddress,
                checkWalletConnected,
                currentAccount,
                checkAdmin,
                connectWallet,
            }}
        >
            {children}
        </ContextAPI.Provider>
    );
}
export function GlobalContext() {
    return useContext(ContextAPI);
}
