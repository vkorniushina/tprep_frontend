import React, {useRef, useState} from "react";
import styles from "./CreateTestModal.module.scss";
import CloseIcon from "../../assets/images/close.svg?react";
import UploadIcon from "../../assets/images/upload.svg?react";
import FileIcon from "../../assets/images/file.svg?react";
import {MAX_FILE_SIZE, ALLOWED_FILE_EXTENSIONS} from "../../constants/fileUpload.js";
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

    const handleCreateFile = async () => {
        const {errors, isValid} = validateTestForm(name, description);
        setFormErrors(errors);

        const fileIsPresent = !!file;

        if (!fileIsPresent && !fileErrorMessage) {
            setFileErrorMessage("Прикрепите файл для создания теста");
        }

        if (!isValid || !fileIsPresent || fileErrorMessage) {
            showToast("error", "Проверьте правильность заполнения формы");
            return;
        }

        const result = await onCreateFromFile({name, description, file});

        if (result.success) {
            onClose();
        } else {
            showToast("error", result.message);
        }
    };

    const handleCreateManual = async () => {
        const {errors, isValid} = validateTestForm(name, description);
        setFormErrors(errors);

        if (!isValid) {
            showToast("error", "Проверьте правильность заполнения формы");
            return;
        }

        const result = await onCreateManual({name, description});

        if (result.success) {
            onClose();
        } else {
            showToast("error", result.message);
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
                    <label className={styles.label}>Шаг 1: Название</label>
                    <input
                        className={formErrors.name && styles.inputError}
                        placeholder="Введите название теста"
                        value={name}
                        onChange={handleNameChange}
                    />
                    {formErrors.name && <div className={styles.errorMessage}>{formErrors.name}</div>}
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Шаг 2: Описание (опционально)</label>
                    <textarea
                        className={formErrors.description && styles.inputError}
                        placeholder="Введите краткое описание"
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                    {formErrors.description && <div className={styles.errorMessage}>{formErrors.description}</div>}
                </div>

                <div>
                    <label className={styles.label}>Шаг 3: Загрузка файла</label>
                    <div
                        className={classNames(
                            styles.dropzone,
                            {
                                [styles.dragging]: isDragging || isHovered || fileErrorMessage,
                                [styles.dropzoneError]: fileErrorMessage
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
                                    {ALLOWED_FILE_EXTENSIONS.join(', ')} (до {MAX_FILE_SIZE / 1024 / 1024} Мб)
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

                <div className={styles.howToPrepare}>
                    <h3>Как подготовить файл?</h3>
                    <p className={styles.howToPrepareIntro}>
                        Используйте заглавные ключевые слова на новой строке, чтобы разделить элементы теста.
                    </p>

                    <div className={styles.instructionBlock}>
                        <p className={styles.instructionHeader}>1. Вопрос с вводом ответа:</p>
                        <span className={styles.instructionLine}>
                        ВОПРОС: Текст вопроса
                        </span>
                        <span className={styles.instructionLine}>
                        ОТВЕТ: Верный ответ
                        </span>
                    </div>

                    <div className={styles.instructionBlock}>
                        <p className={styles.instructionHeader}>2. Вопрос с выбором варианта:</p>
                        <span className={styles.instructionLine}>
                        ВОПРОС: Текст вопроса
                        </span>
                        <span className={styles.instructionLine}>
                        ОТВЕТ: Правильный вариант
                        </span>
                        <span className={styles.instructionLine}>
                        ВАРИАНТ: Неправильный вариант
                        </span>
                        <span className={styles.instructionLine}>
                        ВАРИАНТ: Другой неправильный вариант
                        </span>
                    </div>

                    <p className={styles.howToPrepareImportant}>
                        Важно: Разделяйте каждый отдельный вопрос пустой строкой
                    </p>
                </div>

                <button className={styles.createBtn} onClick={handleCreateFile}>
                    Создать тест из файла
                </button>

                <button className={styles.manualBtn} onClick={handleCreateManual}>
                    Создать вручную
                </button>
            </div>
        </div>
    );
};

export default CreateTestModal;
