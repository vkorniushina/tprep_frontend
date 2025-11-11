import React from "react";
import styles from "./ProgressBar.module.scss";

const ProgressBar = ({ value, total, variant = 'fraction' }) => {
    const percent = (value / total) * 100;
    const displayPercent = Math.round(percent);
    return (
        <div className={styles.wrapper}>
            <div className={styles.track}>
                <div className={styles.fill} style={{ width: `${percent}%` }}></div>
            </div>
            <div className={styles.text}>
                {variant === 'fraction' ? (
                    `${value} / ${total}`
                ) : (
                    `${displayPercent}%`
                )}
            </div>
        </div>
    );
};

export default ProgressBar;
