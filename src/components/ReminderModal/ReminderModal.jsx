import React, {useState, useEffect} from "react";
import styles from "./ReminderModal.module.scss";
import CloseIcon from "../../assets/images/close.svg?react";
import AddIcon from "../../assets/images/add.svg?react";
import CustomSelect from "../CustomSelect/CustomSelect.jsx";
import {
    buildIntervalRows,
    getValidationMessage,
    parseRemindersToRows,
    sortRowsByDate,
    validateRows
} from "../../utils/reminderUtils.js";
import {MODAL_MODES, REMINDER_MODES} from "../../constants/reminderConstants.js";
import {v4 as uuidv4} from 'uuid';
import {toUTCISO} from "../../utils/dateFormatter.js";
import ReminderRow from "../ReminderRow/ReminderRow.jsx";
import {VALIDATION_MESSAGES} from "../../constants/validationMessages.js";
import ModeSelector from "../ModeSelector/ModeSelector.jsx";

const ReminderModal = ({mode = MODAL_MODES.EDIT, reminder, tests = [], onClose, onSave}) => {
    const isEdit = mode === MODAL_MODES.EDIT;

    const [isDuplicateError, setIsDuplicateError] = useState(false);
    const [selectedTestId, setSelectedTestId] = useState("");
    const [reminderMode, setReminderMode] = useState(
        isEdit ? (reminder?.mode ?? REMINDER_MODES.INTERVAL) : REMINDER_MODES.INTERVAL
    );
    const [rows, setRows] = useState([]);
    const [userEdited, setUserEdited] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (isEdit && reminder) {
            const parsed = parseRemindersToRows(reminder.reminders ?? [], reminder.mode);
            setRows(sortRowsByDate(parsed));
        } else {
            setRows(buildIntervalRows(new Date()));
        }
    }, [isEdit, reminder]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const switchMode = (newMode) => {
        if (newMode === reminderMode) return;
        setReminderMode(newMode);
        setUserEdited(false);
        if (newMode === REMINDER_MODES.INTERVAL) {
            setRows(buildIntervalRows(rows[0]?.dateObj ?? new Date()));
        } else if (!isEdit && !userEdited) {
            setRows([
                {id: uuidv4(), dateObj: null, time: ""},
                {id: uuidv4(), dateObj: null, time: ""},
                {id: uuidv4(), dateObj: null, time: ""},
            ]);
        }
    };

    const handleRowChange = (index, field, value) => {
        setRows((prev) => prev.map((r, i) => i === index ? {...r, [field]: value} : r));
        if (reminderMode === REMINDER_MODES.INTERVAL && !userEdited) {
            setUserEdited(true);
            setReminderMode(REMINDER_MODES.MANUAL);
        }
    };

    const addRow = () => {
        setRows((prev) => [...prev, {id: uuidv4(), dateObj: null, time: ""}]);
    };

    const deleteRow = (index) => {
        setRows((prev) => prev.filter((_, i) => i !== index));
    };

    const handleTestChange = (val) => {
        setSelectedTestId(val);
        setIsDuplicateError(false);
    };

    const handleSave = async () => {
        setSubmitted(true);

        const errors = validateRows(rows);
        if ((!isEdit && !selectedTestId) || getValidationMessage(errors)) return;

        setIsDuplicateError(false);
        try {
            await onSave?.({
                testId: isEdit ? reminder.testId : Number(selectedTestId),
                mode: reminderMode,
                reminders: rows.map((r) => toUTCISO(r.dateObj, r.time)).filter(Boolean),
            });
        } catch (err) {
            if (err.response?.status === 409) setIsDuplicateError(true);
        }
    };

    const noTest = !isEdit && !selectedTestId;
    const rowErrors = submitted ? validateRows(rows) : [];
    const validationMessage = submitted ? getValidationMessage(rowErrors) : null;

    return (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <CloseIcon className={styles.closeIcon}/>
                </button>
                <h2 className={styles.modalTitle}>
                    {isEdit ? reminder.testName : "Добавить напоминание"}
                </h2>

                <div className={styles.body}>
                    {!isEdit && (
                        <div className={styles.field}>
                            <label className={styles.label}>Тест</label>
                            <CustomSelect
                                options={tests.map((t) => ({value: t.testId, label: t.testName}))}
                                value={selectedTestId}
                                onChange={handleTestChange}
                                placeholder="Выберите тест"
                                hasError={isDuplicateError || (submitted && noTest)}
                            />
                            {isDuplicateError && (
                                <div className={styles.errorMessage}>
                                    {VALIDATION_MESSAGES.REMINDER_DUPLICATE}
                                </div>
                            )}
                            {submitted && noTest && !isDuplicateError && (
                                <div className={styles.errorMessage}>
                                    {VALIDATION_MESSAGES.REQUIRED}
                                </div>
                            )}
                        </div>
                    )}

                    <ModeSelector
                        activeMode={reminderMode}
                        onModeChange={switchMode}
                    />

                    <div className={styles.field}>
                        <label className={styles.label}>График повторений</label>
                        <div className={styles.rows}>
                            {rows.map((row, i) => (
                                <ReminderRow
                                    key={row.id}
                                    row={row}
                                    index={i}
                                    reminderMode={reminderMode}
                                    hasError={!!rowErrors[i]}
                                    onChange={handleRowChange}
                                    onDelete={deleteRow}
                                />
                            ))}

                            {reminderMode === REMINDER_MODES.MANUAL && (
                                <button className={styles.addRowBtn} onClick={addRow}>
                                    <AddIcon className={styles.addIcon}/>
                                    Добавить повторение
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    {validationMessage && (
                        <div className={styles.validationMessage}>{validationMessage}</div>
                    )}
                    <button className={styles.saveBtn} onClick={handleSave}>Сохранить</button>
                    <button className={styles.cancelBtn} onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>
    );
};

export default ReminderModal;
