import React from "react";
import classNames from "classnames";
import CloseIcon from "../../assets/images/close.svg?react";
import UploadIcon from "../../assets/images/upload.svg?react";
import FileIcon from "../../assets/images/file.svg?react";
import {ALLOWED_FILE_EXTENSIONS, MAX_FILE_SIZE_MB} from "../../constants/fileUpload.js";
import {formatFileSize} from "../../utils/formatFileSize.js";
import styles from "./FileDropzone.module.scss";

const FileDropzone = ({
                          file,
                          inputRef,
                          onFileSelect,
                          onFileRemove,
                          isDragging,
                          isHovered,
                          fileErrorMessage,
                          onDragEnter,
                          onDragOver,
                          onDragLeave,
                          onDrop,
                          onMouseEnter,
                          onMouseLeave
                      }) => {
    const handleClick = () => {
        if (!file) {
            inputRef.current?.click();
        }
    };

    return (
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
                onClick={handleClick}
                onDrop={onDrop}
                onDragEnter={onDragEnter}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
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
                            onClick={onFileRemove}
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
            {fileErrorMessage && (
                <div className={styles.errorMessageFile}>{fileErrorMessage}</div>
            )}
            <input
                type="file"
                ref={inputRef}
                className={styles.hiddenInput}
                accept={ALLOWED_FILE_EXTENSIONS.map(ext => `.${ext}`).join(',')}
                onChange={onFileSelect}
            />
        </div>
    );
};

export default FileDropzone;
