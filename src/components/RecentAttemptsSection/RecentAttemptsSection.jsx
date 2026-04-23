import React from "react";
import styles from "./RecentAttemptsSection.module.scss";
import AttemptItem from "../RecentAttemptItem/RecentAttemptItem.jsx";

const RecentAttemptsSection = ({attempts}) => {
    return (
        <div className={styles.card}>
            <h2 className={styles.cardTitle}>Последние попытки</h2>
            {attempts.length === 0 ? (
                <p className={styles.empty}>Вы пока не проходили тесты</p>
            ) : (
                <div className={styles.list}>
                    {attempts.map((attempt) => (
                        <AttemptItem key={attempt.testId} attempt={attempt}/>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentAttemptsSection;
