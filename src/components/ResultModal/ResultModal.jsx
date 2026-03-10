import React from 'react';
import styles from './ResultModal.module.scss';
import CloseIcon from "../../assets/images/close.svg?react";
import ReloadIcon from "../../assets/images/reload.svg?react";
import ArrowIcon from "../../assets/images/arrow_right.svg?react";
import BellIcon from "../../assets/images/bell.svg?react";

const ResultModal = ({ result, onRetry, onFixErrors, onClose }) => {
    if (!result) return null;

    const { progress, questionsCount } = result;
    const percent = Math.round((progress / questionsCount) * 100);

    const hasErrors = progress < questionsCount;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    <CloseIcon className={styles.closeIcon} />
                </button>

                <h2 className={styles.title}>Результаты теста</h2>

                <div className={styles.stats}>
                    <div className={styles.statRow}>
                        <p>Ваши ответы:</p>
                        <span>{progress}/{questionsCount}</span>
                    </div>
                    <div className={styles.statPercent}>
                        <p>Процент успешности:</p>
                        <span>{percent}%</span>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.retryButton} onClick={onRetry}>
                        Пройти тест заново
                        <ReloadIcon className={styles.reloadIcon} />
                    </button>

                    {hasErrors && (
                        <button className={styles.fixButton} onClick={onFixErrors}>
                            Исправить ошибки
                            <ArrowIcon className={styles.arrowIcon} />
                        </button>
                    )}

                    <button className={styles.reminderButton}>
                        Настроить напоминания
                        <BellIcon className={styles.bellIcon} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;
