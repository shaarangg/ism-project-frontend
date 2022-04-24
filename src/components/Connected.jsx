import React, { useEffect } from "react";
import { GlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
function Connected() {
    const navigate = useNavigate();
    const { checkAdmin, admin } = GlobalContext();
    useEffect(() => {
        checkAdmin();
        if (admin === true) {
            navigate("/admin");
        } else if (admin === false) {
            navigate("/user");
        }
    }, [admin]);
    return <div>Loading...</div>;
}

export default Connected;
