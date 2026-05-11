import React, {useState, useEffect} from "react";
import styles from "./AccessModal.module.scss";
import CloseIcon from "../../assets/images/close.svg?react";
import CopyIcon from "../../assets/images/copy.svg?react";
import CheckIcon from "../../assets/images/tick.svg?react";
import {ACCESS_MODES, ACCESS_OPTIONS} from "../../constants/accessConstants.js";

const AccessModal = ({initialMode, shareLink, onClose, onSave}) => {
    const [selected, setSelected] = useState(initialMode ?? ACCESS_MODES.PRIVATE);
    const [copied, setCopied] = useState(false);
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave?.(selected);
            onClose();
        } catch (err) {
            console.error("Error saving access mode:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleCopy = async () => {
        if (!shareLink) return;
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Ошибка при копировании:", err);
        }
    };

    return (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <CloseIcon className={styles.closeIcon}/>
                </button>

                <h2 className={styles.title}>Настройки доступа к тесту</h2>

                <div className={styles.options}>
                    {ACCESS_OPTIONS.map(({id, title, sub}) => (
                        <label key={id} className={`${styles.option} ${selected === id ? styles.optionSelected : ""}`}>
                            <div className={styles.radioWrapper}>
                                <input
                                    type="radio"
                                    value={id}
                                    checked={selected === id}
                                    onChange={() => setSelected(id)}
                                    className={styles.radioInput}
                                />
                                <span className={styles.radioCircle}></span>
                            </div>
                            <div className={styles.optionText}>
                                <span className={styles.optionTitle}>{title}</span>
                                <span className={styles.optionSub}>{sub}</span>
                            </div>
                        </label>
                    ))}
                </div>

                {selected === ACCESS_MODES.LINK && shareLink && (
                    <div className={styles.linkRow}>
                        <input
                            type="text"
                            className={styles.linkInput}
                            value={shareLink}
                            readOnly
                        />
                        <button
                            className={styles.copyBtn}
                            onClick={handleCopy}
                        >
                            {copied ? (
                                <CheckIcon className={styles.copyIcon} />
                            ) : (
                                <CopyIcon className={styles.copyIcon} />
                            )}
                        </button>

                    </div>
                )}

                <button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Сохранение..." : "Сохранить"}
                </button>
            </div>
        </div>
    );
};

export default AccessModal;
