import React from "react";
import styles from "./ExitConfirmModal.module.scss";
import CloseIcon from "../../assets/images/close.svg?react";

const ExitConfirmModal = ({ open, onCancel, onConfirm }) => {
    if (!open) return null;

    return (
        <div className={styles.confirmOverlay}>
            <div className={styles.confirmBox}>
                <button className={styles.closeModalButton} onClick={onCancel}>
                    <CloseIcon className={styles.closeIcon} />
                </button>

                <h2>Вы точно хотите выйти?</h2>
                <p>Прогресс будет утерян</p>

                <div className={styles.buttons}>
                    <button className={styles.cancelButton} onClick={onCancel}>
                        Остаться
                    </button>
                    <button className={styles.confirmButton} onClick={onConfirm}>
                        Выйти
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExitConfirmModal;
