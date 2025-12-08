import React from "react";
import styles from "./UnsavedChangesModal.module.scss";
import CloseIcon from "../../assets/images/close.svg?react";

const UnsavedChangesModal = ({ isVisible, onSave, onDiscard, onCancel }) => {
    if (!isVisible) return null;

    return (
        <div className={styles.confirmOverlay} onClick={onCancel}>
            <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeModalButton} onClick={onCancel}>
                    <CloseIcon className={styles.closeIcon} />
                </button>

                <h2>Есть несохранённые изменения</h2>
                <p>Сохранить изменения перед выходом?</p>

                <div className={styles.buttons}>
                    <button className={styles.cancelButton} onClick={onDiscard}>
                        Нет
                    </button>
                    <button className={styles.confirmButton} onClick={onSave}>
                         Да
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnsavedChangesModal;
