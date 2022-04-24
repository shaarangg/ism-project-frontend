import React, { useEffect, useState } from "react";
import { GlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
function User() {
    const { currentAccount, openModal } = GlobalContext();
    const { files, setFiles } = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (!currentAccount) {
            navigate("/");
        }
    }, []);
    return (
        <>
            <Modal />
            <div className="add-blog">
                <button
                    type="button"
                    className="btn add-blog-btn"
                    onClick={openModal}
                >
                    Add File
                </button>
            </div>
        </>
    );
}

export default User;
