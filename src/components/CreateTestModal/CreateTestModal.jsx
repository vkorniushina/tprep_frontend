import React, {useRef, useState} from "react";
import styles from "./CreateTestModal.module.scss";
import CloseIcon from "../../assets/images/close.svg?react";
import UploadIcon from "../../assets/images/upload.svg?react";
import FileIcon from "../../assets/images/file.svg?react";
import Sparkles from "../../assets/images/sparkles.svg?react";
import EmptyFile from "../../assets/images/empty_file.svg?react";
import {ALLOWED_FILE_EXTENSIONS, CREATE_TABS, MAX_FILE_SIZE_MB} from "../../constants/fileUpload.js";
import {formatFileSize} from "../../utils/formatFileSize.js";
import {validateFile, validateTestForm} from "../../utils/validateCreateTest.js";
import classNames from "classnames";

const CreateTestModal = ({onClose, onCreateManual, onCreateFromFile, showToast}) => {

    const fileInputRef = useRef(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);

    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const [formErrors, setFormErrors] = useState({});
    const [fileErrorMessage, setFileErrorMessage] = useState(null);

    const [activeTab, setActiveTab] = useState(CREATE_TABS.FILE);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const processFile = (selectedFile, inputRef) => {
        setFileErrorMessage(null);

        if (!selectedFile) return;

        const validation = validateFile(selectedFile);

        if (validation.error) {
            setFileErrorMessage(validation.error);
            if (inputRef.current) inputRef.current.value = "";
            setFile(null);
            return;
        }

        setFile(selectedFile);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleMouseEnter = () => {
        if (!isDragging) {
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
        if (formErrors.name) {
            setFormErrors(prev => ({...prev, name: undefined}));
        }
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        if (formErrors.description) {
            setFormErrors(prev => ({...prev, description: undefined}));
        }
    };

    const handleFileSelect = (e) => {
        processFile(e.target.files[0], fileInputRef);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        setIsHovered(false);
        processFile(e.dataTransfer.files[0], fileInputRef);
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === CREATE_TABS.MANUAL) {
            setFileErrorMessage(null);
        }
    };

    const handleCreateTest = async () => {
        const {errors, isValid} = validateTestForm(name, description);
        setFormErrors(errors);

        if (activeTab === CREATE_TABS.FILE) {
            const fileIsPresent = !!file;

            if (!fileIsPresent && !fileErrorMessage) {
                setFileErrorMessage("Прикрепите файл для создания теста");
            }

            if (!isValid || !fileIsPresent || fileErrorMessage) {
                showToast("error", "Проверьте правильность заполнения формы");
                return;
            }

            setIsSubmitting(true);
            const result = await onCreateFromFile({name, description, file});

            if (result.success) {
                onClose();
            } else {
                showToast("error", result.message);
                setIsSubmitting(false);
            }
        } else {
            if (!isValid) {
                showToast("error", "Проверьте правильность заполнения формы");
                return;
            }

            setIsSubmitting(true);
            const result = await onCreateManual({name, description});

            if (result.success) {
                onClose();
            } else {
                showToast("error", result.message);
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    <CloseIcon className={styles.closeIcon}/>
                </button>

                <h2 className={styles.title}>Создание теста</h2>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Название</label>
                    <input
                        className={formErrors.name && styles.inputError}
                        placeholder="Введите название теста"
                        value={name}
                        onChange={handleNameChange}
                    />
                    {formErrors.name && <div className={styles.errorMessage}>{formErrors.name}</div>}
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Описание (опционально)</label>
                    <textarea
                        className={formErrors.description && styles.inputError}
                        placeholder="Введите краткое описание"
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                    {formErrors.description && <div className={styles.errorMessage}>{formErrors.description}</div>}
                </div>

                <div>
                    <label className={styles.label}>Добавление вопросов</label>
                    <div className={styles.tabs}>
                        <button
                            className={classNames(styles.tab, {[styles.tabActive]: activeTab === CREATE_TABS.FILE})}
                            onClick={() => handleTabChange(CREATE_TABS.FILE)}
                        >
                            Из файла
                        </button>
                        <button
                            className={classNames(styles.tab, {[styles.tabActive]: activeTab === CREATE_TABS.MANUAL})}
                            onClick={() => handleTabChange(CREATE_TABS.MANUAL)}
                        >
                            Вручную
                        </button>
                    </div>

                    {activeTab === CREATE_TABS.FILE ? (
                        <>
                            <div className={styles.fileUploadContainer}>
                                <div
                                    className={classNames(
                                        styles.dropzone,
                                        {
                                            [styles.dragging]: (isDragging || isHovered) && !file,
                                            [styles.dropzoneError]: fileErrorMessage,
                                            [styles.fileUploaded]: !!file
                                        }
                                    )}
                                    onClick={!file ? () => fileInputRef.current.click() : undefined}
                                    onDrop={handleDrop}
                                    onDragEnter={handleDragEnter}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {file ? (
                                        <div className={styles.fileDisplay}>
                                            <FileIcon className={styles.fileIcon}/>
                                            <div className={styles.fileInfo}>
                                                <p className={styles.fileName}>{file.name}</p>
                                                <span className={styles.fileSize}>
                                                {formatFileSize(file.size)}
                                            </span>
                                            </div>
                                            <button
                                                className={styles.removeFileBtn}
                                                onClick={handleRemoveFile}
                                            >
                                                <CloseIcon className={styles.removeFileIcon}/>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={styles.fileText}>
                                            <UploadIcon className={styles.uploadIcon}/>
                                            <p>Перетащите файл сюда или нажмите, чтобы загрузить</p>
                                            <p className={styles.supportText}>
                                                {ALLOWED_FILE_EXTENSIONS.join(', ')} (до {MAX_FILE_SIZE_MB} Мб)
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {fileErrorMessage && <div className={styles.errorMessageFile}>{fileErrorMessage}</div>}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className={styles.hiddenInput}
                                accept={ALLOWED_FILE_EXTENSIONS.map(ext => `.${ext}`).join(',')}
                                onChange={handleFileSelect}
                            />

                            <div className={styles.hint}>
                                <div className={styles.hintHeader}>
                                    <Sparkles className={classNames(styles.hintIcon, styles.aiIcon)}/>
                                    <p className={styles.hintTitle}>
                                        Система автоматически распознает вопросы и ответы и создаст тест на их основе
                                    </p>
                                </div>
                                <p className={styles.hintDescription}>
                                    Вам останется только проверить результат и отредактировать его при необходимости
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className={styles.hint}>
                            <div className={styles.hintHeader}>
                                <EmptyFile className={styles.hintIcon}/>
                                <p className={styles.hintTitle}>Вопросы будут добавлены позже</p>
                            </div>
                            <p className={styles.hintDescription}>
                                После создания теста вы перейдете на страницу редактирования, где сможете добавить
                                вопросы вручную
                            </p>
                        </div>
                    )}
                </div>

                <button
                    className={styles.createBtn}
                    onClick={handleCreateTest}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        activeTab === CREATE_TABS.FILE ? "Обработка файла..." : "Создание..."
                    ) : (
                        "Создать тест"
                    )}
                </button>
            </div>
        </div>
    );
};

export default CreateTestModal;
