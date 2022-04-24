import React from "react";
import { FaTimes } from "react-icons/fa";
import { GlobalContext } from "../context";
function Modal() {
    const { isModalOpen, closeModal, handleSubmit, contentRef, disabled } =
        GlobalContext();
    return (
        <div
            className={`${
                isModalOpen ? "modal-overlay show-modal" : "modal-overlay"
            }`}
        >
            <div className="modal-container">
                <form className="form" onSubmit={handleSubmit}>
                    <input
                        name="content"
                        className="input"
                        placeholder="Add link to the file"
                        id="content"
                        ref={contentRef}
                    ></input>
                    <button type="submit" className="btn modal-btn">
                        Submit
                    </button>
                </form>
                <button
                    className="close-modal-btn"
                    disabled={disabled}
                    onClick={closeModal}
                >
                    <FaTimes />
                </button>
            </div>
        </div>
    );
}
export default Modal;
