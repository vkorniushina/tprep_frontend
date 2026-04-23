import React from "react";
import styles from "./StatsCard.module.scss";

const StatCard = ({value, label, Icon}) => {
    return (
        <div className={styles.card}>
            <div className={styles.cardContent}>
                <div>
                    <p className={styles.value}>{value}</p>
                    <p className={styles.label}>{label}</p>
                </div>
                <div className={styles.icon}>
                    <Icon/>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
