import React, { useContext, useRef, useState } from "react";
import { ethers } from "ethers";
import abi from "./abis/Piracy.json";
import networks from "./utils/networks";

const CONTRACT_ADDRESS = "0xDeD20f4Ea98732840084389CE1B75540539E235D";
const CONTRACT_ABI = abi.abi;

const ContextAPI = React.createContext();

export function AppProvider({ children }) {
    const [currentAccount, setCurrentAccount] = useState("");
    const [network, setNetwork] = useState("");
    const contract = useRef();
    const contentRef = useRef("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [files, setFiles] = useState([]);
    const [admin, setAdmin] = useState(null);
    const [pendingFiles, setPendingFiles] = useState([]);
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
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const con = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            contract.current = con;
            if (ethereum) {
                const address = await signer.getAddress();
                const tx = await con.checkIsAdmin(address);
                setAdmin(tx);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setDisabled(true);
            const res = await contract.current.addFile(contentRef.current.value);
            contentRef.current.value = "";
            setDisabled(false);
            closeModal();
            getAllFiles();
        } catch (e) {
            console.log(e);
        }
    };
    const getAllFiles = async () => {
        try {
            const allFiles = await contract.current.getAllFiles();
            const approvedFilesPromise = allFiles.map(async (f) => {
                const add = await contract.current.getFileOwner(f);
                const x = add.toLowerCase();
                if (x === currentAccount) {
                    return { status: "approved", name: f };
                }
                return {};
            });
            let approvedFiles = await Promise.all(approvedFilesPromise);
            approvedFiles = approvedFiles.filter((f) => Object.keys(f).length !== 0);
            const pendingFile = await contract.current.getPendingFileFromAddress(currentAccount);
            if (pendingFile) {
                console.log(pendingFile);
                approvedFiles.push({ status: "pending", name: pendingFile });
            }
            setFiles(approvedFiles);
        } catch (e) {
            console.log(e);
        }
    };
    const fetchRequests = async () => {
        try {
            let pendingAddresses = await contract.current.getPendingAddresses();
            pendingAddresses = [...new Set(pendingAddresses)];
            let pf = [];
            for (let i = 0; i < pendingAddresses.length; i++) {
                const name = await contract.current.getPendingFileFromAddress(pendingAddresses[i]);
                if (name)
                    pf.push({
                        address: pendingAddresses[i],
                        file: name,
                    });
            }
            setPendingFiles(pf);
        } catch (e) {
            console.log(e);
        }
    };
    const rejectRequest = async (add) => {
        try {
            const res = await contract.current.deleteFile(add);
            console.log(res);
        } catch (e) {
            console.log(e);
        }
    };
    const approveRequest = async (add) => {
        try {
            await contract.current.approve(add);
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <ContextAPI.Provider
            value={{
                approveRequest,
                rejectRequest,
                fetchRequests,
                pendingFiles,
                admin,
                files,
                getAllFiles,
                isModalOpen,
                disabled,
                openModal,
                closeModal,
                contentRef,
                handleSubmit,
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
