import React from "react";
import styles from "./RecentAttemptsSection.module.scss";
import AttemptItem from "../RecentAttemptItem/RecentAttemptItem.jsx";

const RecentAttemptsSection = ({attempts}) => {
    return (
        <div className={styles.card}>
            <h2 className={styles.cardTitle}>Последние попытки</h2>
            <div className={styles.list}>
                {attempts.map((attempt) => (
                    <AttemptItem key={attempt.testId} attempt={attempt}/>
                ))}
            </div>
        </div>
    );
};

export default RecentAttemptsSection;