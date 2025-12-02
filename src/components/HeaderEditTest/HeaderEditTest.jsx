import React from "react";
import styles from "./HeaderEditTest.module.scss";
import arrowLeft from "../../assets/images/arrow_left.svg";
import saveIcon from "../../assets/images/save.svg";
import {useNavigate} from "react-router-dom";

const HeaderEditTest = ({ onSave }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.inner}`}>
                <div className={styles.left}>
                    <img src={arrowLeft}
                         className={styles.backIcon}
                         onClick={handleBack}
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
