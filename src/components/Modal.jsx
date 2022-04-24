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
                    <label htmlFor="content">Content</label>
                    <textarea
                        name="content"
                        className="input"
                        placeholder="Add content"
                        id="content"
                        ref={contentRef}
                        cols="100"
                        rows="20"
                    ></textarea>
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
