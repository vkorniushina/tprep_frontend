import React from 'react';
import styles from './ReminderFooter.module.scss';

const ReminderFooter = ({onSave, onCancel, validationMessage}) => {
    return (
        <div className={styles.footer}>
            {validationMessage && (
                <div className={styles.validationMessage}>{validationMessage}</div>
            )}
            <button className={styles.saveBtn} onClick={onSave}>
                Сохранить
            </button>
            <button className={styles.cancelBtn} onClick={onCancel}>
                Отмена
            </button>
        </div>
    );
};

export default ReminderFooter;
