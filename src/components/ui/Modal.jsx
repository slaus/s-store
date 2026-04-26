import React from 'react';
import { IoCloseOutline } from "react-icons/io5";
import modal from "@styles/Modal.module.css";

const Modal = ({ setIsModalOpen, children }) => {
    const closeModal = () => {
        setIsModalOpen(false);
    }

    return (
        <div className={modal._}>
            <div className={modal.modal}>
                <button className={modal.close} onClick={closeModal}>
                    <IoCloseOutline size={36} />
                </button>
                <div className={modal.content}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;