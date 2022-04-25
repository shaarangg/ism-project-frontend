import React, { useEffect, useState } from "react";
import { GlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import Files from "../components/Files";
function User() {
    const { currentAccount, openModal, getAllFiles, files } = GlobalContext();
    const navigate = useNavigate();
    useEffect(() => {
        if (!currentAccount) {
            navigate("/");
        } else {
            getAllFiles();
        }
    }, []);
    return (
        <>
            <Modal />
            <main>
                <Files files={files} />
            </main>
            <div className="add-blog">
                <button type="button" className="btn add-blog-btn" onClick={openModal}>
                    Add File
                </button>
            </div>
        </>
    );
}

export default User;
