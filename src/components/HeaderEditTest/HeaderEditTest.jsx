import React from "react";
import styles from "./HeaderEditTest.module.scss";
import arrowLeft from "../../assets/images/arrow_left.svg";
import saveIcon from "../../assets/images/save.svg";

const HeaderEditTest = ({ onBack, onSave }) => {

    return (
        <header className={styles.header}>
            <div className={`container ${styles.inner}`}>
                <div className={styles.left}>
                    <img src={arrowLeft}
                         className={styles.backIcon}
                         onClick={onBack}
                    />
                    <h1 className={styles.title}>Редактирование теста</h1>
                </div>

                <button className={styles.editBtn} onClick={onSave}>
                    <img src={saveIcon}/> Сохранить изменения
                </button>
            </div>
        </header>
    );
};

export default HeaderEditTest;
