import React, { useEffect } from "react";
import File from "./File";
function Files({ files }) {
    return (
        <section>
            <div className="title">
                <h2>Files</h2>
                <div className="underline"></div>
            </div>
            <div>
                {files.map((file, index) => {
                    return <File key={index} file={file} idx={index} />;
                })}
            </div>
        </section>
    );
}

export default Files;
