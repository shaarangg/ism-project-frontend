import React from "react";
import { GlobalContext } from "../context";
function Connected() {
    const { checkAdmin } = GlobalContext();
    checkAdmin();
    return <div>You are successfully connected</div>;
}

export default Connected;
