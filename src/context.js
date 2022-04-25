import React, { useContext, useRef, useState } from "react";
import { ethers } from "ethers";
import abi from "./abis/Piracy.json";
import networks from "./utils/networks";

const CONTRACT_ADDRESS = "0x3A33136C37D9fb33de487c6e3912E0742449c00E";
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

    const getAllFiles = () => {
        try {
            const allFilesPromise = contract.current.getAllFiles();
            const allFiles = allFilesPromise.then((res) => {
                const approvedFiles = res.map((file) => {
                    const add = contract.current.getFileOwner(file);
                    add.then((res) => {
                        if (res === currentAccount) {
                            return {
                                status: "approved",
                                name: file,
                            };
                        }
                    });
                    return;
                });
                return approvedFiles;
            });
            const pendingFile = contract.current.getPendingFileFromAddress(currentAccount);
            pendingFile.then((res) => {
                let f = [];
                for (let i = 0; i < allFiles.length; i++) {
                    f.push(allFiles[i]);
                }
                if (res) f.push({ status: "pending", name: res });
                setFiles(f);
            });
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
            await contract.current.deleteFile(add);
            fetchRequests();
        } catch (e) {
            console.log(e);
        }
    };
    const approveRequest = async (add) => {
        try {
            await contract.current.approve(add);
            fetchRequests();
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
