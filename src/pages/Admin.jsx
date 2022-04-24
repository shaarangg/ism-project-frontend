import React, { useEffect } from "react";
import { GlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
function Admin() {
    const {
        currentAccount,
        pendingFiles,
        fetchRequests,
        rejectRequest,
        approveRequest,
    } = GlobalContext();
    const navigate = useNavigate();
    useEffect(() => {
        if (!currentAccount) {
            navigate("/");
        } else {
            fetchRequests();
        }
    }, []);
    return (
        <main>
            <div className="title">
                <h2>Pending Requests</h2>
                <div className="underline" style={{ width: "200px" }}></div>
            </div>
            {pendingFiles.map((f, idx) => {
                const { address, file } = f;
                return (
                    <article key={idx} className="single-file">
                        <div
                            className="file-header"
                            style={{
                                justifyContent: "flex-start",
                                gap: "1rem",
                            }}
                        >
                            <div className="index">
                                <p>{idx + 1}</p>
                            </div>
                            <div className="status">
                                Wallet Address: {address}
                            </div>
                        </div>
                        <div className="name">{file}</div>
                        <div className="btn-container">
                            <button
                                type="button"
                                className="accept-btn"
                                onClick={() => approveRequest(address)}
                            >
                                Approve
                            </button>{" "}
                            <button
                                type="button"
                                className="delete-btn"
                                onClick={() => {
                                    rejectRequest(address);
                                }}
                            >
                                Reject
                            </button>
                        </div>
                    </article>
                );
            })}
        </main>
    );
}

export default Admin;
