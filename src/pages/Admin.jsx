import React, { useEffect } from "react";
import { GlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
function Admin() {
    const { currentAccount } = GlobalContext();
    const navigate = useNavigate();
    useEffect(() => {
        if (!currentAccount) {
            navigate("/");
        }
    }, []);
    return <div>You landed on admin page</div>;
}

export default Admin;
