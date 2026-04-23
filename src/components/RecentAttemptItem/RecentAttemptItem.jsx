import React from "react";
import BookIcon from "../../assets/images/book.svg?react";
import styles from "./RecentAttemptItem.module.scss";
import {formatDateTime} from "../../utils/dateFormatter.js";

const RecentAttemptItem = ({attempt}) => {
    const percent = attempt.total > 0
        ? Math.round((attempt.score / attempt.total) * 100)
        : 0;

    return (
        <div className={styles.item}>
            <div className={styles.icon}>
                <BookIcon/>
            </div>
            <div className={styles.info}>
                <span className={styles.title}>{attempt.testName}</span>
                <span className={styles.date}>{formatDateTime(attempt.date)}</span>
            </div>
            <div className={styles.score}>
                <span className={styles.scoreValue}>{attempt.score}/{attempt.total}</span>
                <span className={styles.scorePercent}>{percent}%</span>
            </div>
        </div>
    );
};

export default RecentAttemptItem;
