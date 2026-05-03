import React, {useState} from "react";
import styles from "./CreateTestModal.module.scss";
import CloseIcon from "../../assets/images/close.svg?react";
import Sparkles from "../../assets/images/sparkles.svg?react";
import EmptyFile from "../../assets/images/empty_file.svg?react";
import {CREATE_TABS} from "../../constants/fileUpload.js";
import {validateTestForm} from "../../utils/validateCreateTest.js";
import InfoHint from "../InfoHint/InfoHint.jsx";
import Tabs from "../Tabs/Tabs.jsx";
import FileDropzone from "../FileDropzone/FileDropzone.jsx";
import {CREATE_TEST_TABS} from "../../constants/testConstants.js";
import {useFileUpload} from "../../hooks/useFileUpload.jsx";

const CreateTestModal = ({onClose, onCreateManual, onCreateFromFile, showToast}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [activeTab, setActiveTab] = useState(CREATE_TABS.FILE);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        file,
        inputRef,
        isDragging,
        isHovered,
        fileErrorMessage,
        handleFileSelect,
        handleDrop,
        handleRemoveFile,
        handleDragEnter,
        handleDragOver,
        handleDragLeave,
        handleMouseEnter,
        handleMouseLeave,
        clearFileError,
        setFileErrorMessage
    } = useFileUpload();

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

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === CREATE_TABS.MANUAL) {
            clearFileError();
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
                    <Tabs
                        tabs={CREATE_TEST_TABS}
                        activeTab={activeTab}
                        onChange={handleTabChange}
                    />

                    {activeTab === CREATE_TABS.FILE ? (
                        <>
                            <FileDropzone
                                file={file}
                                inputRef={inputRef}
                                onFileSelect={handleFileSelect}
                                onFileRemove={handleRemoveFile}
                                isDragging={isDragging}
                                isHovered={isHovered}
                                fileErrorMessage={fileErrorMessage}
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            />

                            <InfoHint
                                Icon={Sparkles}
                                iconClassName={styles.aiIcon}
                                title="Система автоматически распознает вопросы и ответы и создаст тест на их основе"
                                description="Вам останется только проверить результат и отредактировать его при необходимости"
                            />
                        </>
                    ) : (
                        <InfoHint
                            Icon={EmptyFile}
                            title="Вопросы будут добавлены позже"
                            description="После создания теста вы перейдете на страницу редактирования, где сможете добавить вопросы вручную"
                        />
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
