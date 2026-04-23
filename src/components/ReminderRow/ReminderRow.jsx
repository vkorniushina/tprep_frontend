import React from "react";
import styles from "./ReminderRow.module.scss";
import TrashIcon from "../../assets/images/trash.svg?react";
import DatePickerInput from "../DatePickerInput/DatePickerInput.jsx";
import TimePickerInput from "../TimePickerInput/TimePickerInput.jsx";
import {REMINDER_MODES} from "../../constants/reminderConstants.js";

const ReminderRow = ({row, index, reminderMode, hasError, onChange, onDelete}) => {
    const label = reminderMode === REMINDER_MODES.INTERVAL
        ? (row.label ?? `Повторение ${index + 1}`)
        : `Повторение ${index + 1}`;

    return (
        <div className={styles.row}>
            <span className={styles.rowLabel}>{label}</span>
            <div className={styles.rowInputs}>
                <DatePickerInput
                    value={row.dateObj}
                    onChange={(date) => onChange(index, "dateObj", date)}
                    hasError={hasError}
                />
                <TimePickerInput
                    value={row.time}
                    onChange={(time) => onChange(index, "time", time)}
                    hasError={hasError}
                />
                {reminderMode === REMINDER_MODES.MANUAL && (
                    <button
                        className={styles.deleteRowBtn}
                        onClick={() => onDelete(index)}
                    >
                        <TrashIcon/>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReminderRow;
