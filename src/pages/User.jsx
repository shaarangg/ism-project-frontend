import React, { useEffect } from "react";
import { GlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
function User() {
    const { currentAccount } = GlobalContext();
    const navigate = useNavigate();
    useEffect(() => {
        if (!currentAccount) {
            navigate("/");
        }
    }, []);
    return <div>You landed on user page</div>;
}

export default User;
