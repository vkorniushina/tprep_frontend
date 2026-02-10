import React from "react";
import styles from "./ProgressBar.module.scss";

const ProgressBar = ({ value, total, variant = 'fraction' }) => {
    const percent = total === 0 ? 0 : Math.round((value / total) * 100);

    return (
        <div className={styles.wrapper}>
            <div className={styles.track}>
                <div className={styles.fill} style={{ width: `${percent}%` }}></div>
            </div>
            <div className={styles.text}>
                {variant === 'fraction' ? (
                    `${value} / ${total}`
                ) : (
                    `${percent}%`
                )}
            </div>
        </div>
    );
};

export default ProgressBar;
