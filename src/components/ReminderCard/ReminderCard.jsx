import React from "react";
import styles from "./ReminderCard.module.scss";
import BookIcon from "../../assets/images/book.svg?react";
import EditIcon from "../../assets/images/edit.svg?react";
import TrashIcon from "../../assets/images/trash.svg?react";
import ClockIcon from "../../assets/images/clock.svg?react";
import classNames from 'classnames';
import {formatShortDateTime} from "../../utils/dateFormatter.js";

const ReminderCard = ({reminder, onEdit, onDelete}) => {
    const {testName, reminders: dates = []} = reminder;

    const now = new Date();
    const upcomingSorted = dates
        .filter((d) => new Date(d.datetime) >= now)
        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.block}>
                    <div className={styles.icon}>
                        <BookIcon/>
                    </div>
                    <span className={styles.title}>{testName}</span>
                </div>

                <div className={styles.actions}>
                    <button className={styles.actionBtn} onClick={onEdit}>
                        <EditIcon/>
                    </button>
                    <button className={styles.actionBtn} onClick={onDelete}>
                        <TrashIcon/>
                    </button>
                </div>
            </div>

            <div className={styles.dates}>
                {upcomingSorted.length > 0 && (
                    upcomingSorted.map((d, i) => (
                        <span
                            key={d.id}
                            className={classNames(styles.badge, {
                                [styles.badgeActive]: i === 0,
                            })}
                        >
                            <ClockIcon/>
                            {formatShortDateTime(d.datetime)}
                        </span>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReminderCard;
