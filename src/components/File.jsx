import React from "react";
function File({ idx, file }) {
    const { name, status } = file;
    return (
        <article className="single-file">
            <div className="file-header">
                <div className="index">
                    <p>{idx + 1}</p>
                </div>
                <div className="status">Status: {status}</div>
            </div>
            <div className="name">{name}</div>
        </article>
    );
}
export default File;
