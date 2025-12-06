import React, { useEffect } from "react";
import styles from "./ToastNotification.module.scss";

const ToastNotification = ({ type = "success", message, onClose }) => {

    useEffect(() => {
        const timer = setTimeout(() => onClose(), 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            <div className={styles.icon}/>
            <span>{message}</span>
        </div>
    );
};

export default ToastNotification;
