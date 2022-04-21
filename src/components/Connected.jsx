import React from "react";
import { GlobalContext } from "../context";
function Connected() {
    const { checkAdmin } = GlobalContext();
    const admin = checkAdmin();
    return <div>You are successfully connected</div>;
}

export default Connected;
