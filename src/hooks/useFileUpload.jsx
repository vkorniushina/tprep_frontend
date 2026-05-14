import {useState, useRef} from "react";
import {validateFile} from "../utils/validateCreateTest.js";

export const useFileUpload = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [fileErrorMessage, setFileErrorMessage] = useState(null);
    const inputRef = useRef(null);

    const processFile = (selectedFile) => {
        setFileErrorMessage(null);

        if (!selectedFile) return;

        const validation = validateFile(selectedFile);

        if (validation.error) {
            setFileErrorMessage(validation.error);
            setFile(null);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
            return;
        }

        setFile(selectedFile);
    };

    const handleFileSelect = (e) => {
        processFile(e.target.files[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        setIsHovered(false);
        processFile(e.dataTransfer.files[0]);
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setFile(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
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

    const clearFileError = () => {
        setFileErrorMessage(null);
    };

    return {
        file,
        isDragging,
        isHovered,
        fileErrorMessage,
        inputRef,
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
    };
};
