import React, {useState} from "react";
import styles from "./RemindersSection.module.scss";
import {useReminders} from "../../hooks/useReminders.js";
import {useModules} from "../../hooks/useModules.js";
import ReminderCard from "../ReminderCard/ReminderCard.jsx";
import ReminderModal from "../ReminderModal/ReminderModal.jsx";
import AddIcon from "../../assets/images/add.svg?react";
import {MODAL_MODES} from "../../constants/reminderConstants.js";
import {useToast} from "../../hooks/useToast.js";
import ToastNotification from "../ToastNotification/ToastNotification.jsx";

const RemindersSection = () => {
    const {reminders, loading, error, create, update, remove} = useReminders();
    const {tests} = useModules();

    const [editingReminder, setEditingReminder] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const {toast, showToast, hideToast} = useToast();

    const closeModals = () => {
        setEditingReminder(null);
        setIsAdding(false);
    };

    const handleDelete = async (testId) => {
        try {
            await remove(testId);
            showToast("Напоминание удалено", "success");
        } catch {
            showToast("Не удалось удалить напоминание", "error");
        }
    };

    const handleSave = async (payload) => {
        try {
            if (editingReminder) {
                await update(payload.testId, payload);
                showToast("Изменения сохранены", "success");
            } else {
                await create(payload);
                showToast("Напоминание добавлено", "success");
            }
            closeModals();
        } catch (err) {
            if (err.response?.status === 409) throw err;
            if (editingReminder) {
                showToast("Не удалось сохранить изменения", "error");
            } else {
                showToast("Не удалось создать напоминание", "error");
            }
            closeModals();
        }
    };

    return (
        <div className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>Активные напоминания</h2>
                <button
                    className={styles.addButton}
                    onClick={() => setIsAdding(true)}
                >
                    <AddIcon className={styles.addIcon}/>
                    Добавить напоминание
                </button>
            </div>

            {loading && <div className={styles.empty}>Загрузка...</div>}
            {error && <div className={styles.empty}>{error}</div>}

            {!loading && !error && (
                <div className={styles.list}>
                    {reminders.length === 0 ? (
                        <div className={styles.empty}>
                            Нет активных напоминаний
                        </div>
                    ) : (
                        reminders.map((reminder) => (
                            <ReminderCard
                                key={reminder.testId}
                                reminder={reminder}
                                onEdit={() => setEditingReminder(reminder)}
                                onDelete={() => handleDelete(reminder.testId)}
                            />
                        ))
                    )}
                </div>
            )}

            {editingReminder && (
                <ReminderModal
                    mode={MODAL_MODES.EDIT}
                    reminder={editingReminder}
                    onClose={closeModals}
                    onSave={handleSave}
                />
            )}

            {isAdding && (
                <ReminderModal
                    mode={MODAL_MODES.ADD}
                    tests={tests}
                    onClose={closeModals}
                    onSave={handleSave}
                />
            )}

            {toast && (
                <ToastNotification
                    type={toast.type}
                    message={toast.message}
                    onClose={hideToast}
                />
            )}
        </div>
    );
};

export default RemindersSection;
