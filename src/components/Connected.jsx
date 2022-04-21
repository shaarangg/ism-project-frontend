import React, { useEffect } from "react";
import { GlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
function Connected() {
    const navigate = useNavigate();
    const { checkAdmin } = GlobalContext();
    useEffect(() => {
        const admin = checkAdmin();
        if (admin) {
            navigate("/admin");
        } else {
            navigate("/user");
        }
    }, []);
    return <div>Loading...</div>;
}

export default Connected;
